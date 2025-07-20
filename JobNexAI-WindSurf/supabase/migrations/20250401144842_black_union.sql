/*
  # Add job alerts table

  1. New Table
    - `job_alerts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `keywords` (text array)
      - `locations` (text array)
      - `job_types` (text array)
      - `salary_min` (numeric)
      - `salary_max` (numeric)
      - `frequency` (text)
      - `is_active` (boolean)
      - `last_sent_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for users to manage their alerts
*/

-- Create job alerts table
CREATE TABLE job_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  keywords text[] NOT NULL DEFAULT '{}',
  locations text[] NOT NULL DEFAULT '{}',
  job_types text[] NOT NULL DEFAULT '{}',
  salary_min numeric,
  salary_max numeric,
  frequency text NOT NULL CHECK (frequency IN ('daily', 'weekly')),
  is_active boolean DEFAULT true,
  last_sent_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE job_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own alerts"
  ON job_alerts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to process job alerts
CREATE OR REPLACE FUNCTION process_job_alerts() RETURNS void AS $$
DECLARE
  v_alert RECORD;
  v_jobs RECORD;
BEGIN
  -- Process each active alert
  FOR v_alert IN
    SELECT *
    FROM job_alerts
    WHERE is_active = true
    AND (
      frequency = 'daily'
      OR (frequency = 'weekly' AND (last_sent_at IS NULL OR last_sent_at < now() - interval '7 days'))
    )
  LOOP
    -- Find matching jobs
    FOR v_jobs IN
      SELECT j.*
      FROM jobs j
      WHERE
        -- Match keywords
        (v_alert.keywords = '{}' OR
         EXISTS (
           SELECT 1
           FROM unnest(v_alert.keywords) k
           WHERE j.title ILIKE '%' || k || '%'
              OR j.description ILIKE '%' || k || '%'
         ))
        -- Match locations
        AND (v_alert.locations = '{}' OR j.location = ANY(v_alert.locations))
        -- Match job types
        AND (v_alert.job_types = '{}' OR j.job_type = ANY(v_alert.job_types))
        -- Match salary range
        AND (
          v_alert.salary_min IS NULL
          OR v_alert.salary_max IS NULL
          OR (j.salary_min >= v_alert.salary_min AND j.salary_max <= v_alert.salary_max)
        )
        -- Only jobs from the last day for daily alerts
        AND (
          v_alert.frequency = 'weekly'
          OR j.created_at > now() - interval '1 day'
        )
    LOOP
      -- Here you would typically send an email or notification
      -- For now, we'll just log it
      INSERT INTO audit_logs (
        user_id,
        action,
        table_name,
        record_id,
        new_data
      ) VALUES (
        v_alert.user_id,
        'JOB_ALERT_MATCH',
        'jobs',
        v_jobs.id,
        jsonb_build_object(
          'alert_id', v_alert.id,
          'job_id', v_jobs.id,
          'job_title', v_jobs.title
        )
      );
    END LOOP;

    -- Update last_sent_at
    UPDATE job_alerts
    SET last_sent_at = now()
    WHERE id = v_alert.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;