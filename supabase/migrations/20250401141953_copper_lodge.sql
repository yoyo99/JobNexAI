/*
  # Add matching system tables and functions

  1. New Tables
    - `audit_logs` - For tracking changes and GDPR compliance
    - `user_preferences` - User job preferences and matching criteria
    - `skills` - Skills taxonomy
    - `job_skills` - Skills required for jobs
    - `user_skills` - User's skills and expertise levels
    - `job_matches` - Matches between users and jobs with scoring

  2. Security
    - Enable RLS on all tables
    - Add policies for user data protection
    - Implement GDPR compliance measures
*/

-- Create audit log table
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create user preferences table
CREATE TABLE user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_types text[] NOT NULL DEFAULT '{}',
  preferred_locations text[] NOT NULL DEFAULT '{}',
  min_salary numeric,
  max_salary numeric,
  remote_preference text CHECK (remote_preference IN ('remote', 'hybrid', 'onsite', 'any')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- Create skills taxonomy
CREATE TABLE skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create job skills table
CREATE TABLE job_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  skill_id uuid REFERENCES skills(id) ON DELETE CASCADE NOT NULL,
  importance text CHECK (importance IN ('required', 'preferred', 'nice_to_have')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(job_id, skill_id)
);

-- Create user skills table
CREATE TABLE user_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  skill_id uuid REFERENCES skills(id) ON DELETE CASCADE NOT NULL,
  proficiency_level integer CHECK (proficiency_level BETWEEN 1 AND 5),
  years_experience numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

-- Create job matches table
CREATE TABLE job_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  match_score numeric CHECK (match_score BETWEEN 0 AND 100),
  skills_match_percentage numeric CHECK (skills_match_percentage BETWEEN 0 AND 100),
  salary_match boolean,
  location_match boolean,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, job_id)
);

-- Enable RLS on all tables
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_matches ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read their own preferences"
  ON user_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read skills"
  ON skills
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read job skills"
  ON job_skills
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own skills"
  ON user_skills
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read their own matches"
  ON job_matches
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to calculate job match score
CREATE OR REPLACE FUNCTION calculate_job_match_score(
  p_user_id uuid,
  p_job_id uuid
) RETURNS numeric AS $$
DECLARE
  v_skills_match numeric;
  v_location_match boolean;
  v_salary_match boolean;
  v_final_score numeric;
BEGIN
  -- Calculate skills match percentage
  SELECT 
    COALESCE(
      (
        COUNT(CASE WHEN us.skill_id = js.skill_id AND 
          (js.importance = 'required' AND us.proficiency_level >= 3) OR
          (js.importance = 'preferred' AND us.proficiency_level >= 2) OR
          (js.importance = 'nice_to_have' AND us.proficiency_level >= 1)
        THEN 1 END)::numeric / 
        NULLIF(COUNT(js.skill_id), 0) * 100
      ),
      0
    )
  INTO v_skills_match
  FROM job_skills js
  LEFT JOIN user_skills us ON us.skill_id = js.skill_id AND us.user_id = p_user_id
  WHERE js.job_id = p_job_id;

  -- Calculate location match
  SELECT EXISTS (
    SELECT 1
    FROM user_preferences up
    JOIN jobs j ON j.location = ANY(up.preferred_locations)
    WHERE up.user_id = p_user_id AND j.id = p_job_id
  ) INTO v_location_match;

  -- Calculate salary match
  SELECT EXISTS (
    SELECT 1
    FROM user_preferences up
    JOIN jobs j ON 
      (j.salary_min IS NULL OR j.salary_min >= up.min_salary) AND
      (j.salary_max IS NULL OR j.salary_max <= up.max_salary)
    WHERE up.user_id = p_user_id AND j.id = p_job_id
  ) INTO v_salary_match;

  -- Calculate final score
  v_final_score := (
    v_skills_match * 0.6 +
    (CASE WHEN v_location_match THEN 20 ELSE 0 END) +
    (CASE WHEN v_salary_match THEN 20 ELSE 0 END)
  );

  RETURN v_final_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update job matches
CREATE OR REPLACE FUNCTION update_job_matches(p_user_id uuid) RETURNS void AS $$
BEGIN
  -- Delete existing matches for the user
  DELETE FROM job_matches WHERE user_id = p_user_id;
  
  -- Insert new matches
  INSERT INTO job_matches (user_id, job_id, match_score)
  SELECT 
    p_user_id,
    j.id,
    calculate_job_match_score(p_user_id, j.id)
  FROM jobs j
  WHERE j.posted_at >= NOW() - interval '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to log changes
CREATE OR REPLACE FUNCTION audit_log_changes() RETURNS trigger AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    old_data,
    new_data,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to tables
CREATE TRIGGER audit_user_preferences
  AFTER INSERT OR UPDATE OR DELETE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION audit_log_changes();

CREATE TRIGGER audit_user_skills
  AFTER INSERT OR UPDATE OR DELETE ON user_skills
  FOR EACH ROW EXECUTE FUNCTION audit_log_changes();

CREATE TRIGGER audit_job_matches
  AFTER INSERT OR UPDATE OR DELETE ON job_matches
  FOR EACH ROW EXECUTE FUNCTION audit_log_changes();

-- Create function to set expiration date
CREATE OR REPLACE FUNCTION set_preferences_expiration() RETURNS trigger AS $$
BEGIN
  NEW.expires_at := NEW.created_at + interval '3 years';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to set expiration date on insert
CREATE TRIGGER set_preferences_expiration_on_insert
  BEFORE INSERT ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION set_preferences_expiration();

-- Create function to cleanup expired data
CREATE OR REPLACE FUNCTION cleanup_expired_data() RETURNS void AS $$
BEGIN
  -- Delete expired user preferences
  DELETE FROM user_preferences
  WHERE expires_at < NOW();
  
  -- Delete old audit logs (keep 1 year)
  DELETE FROM audit_logs
  WHERE created_at < NOW() - interval '1 year';
  
  -- Delete old job matches (keep 30 days)
  DELETE FROM job_matches
  WHERE created_at < NOW() - interval '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;