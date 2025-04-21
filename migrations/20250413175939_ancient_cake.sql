/*
  # Add job interviews table

  1. New Table
    - `job_interviews`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `job_application_id` (uuid, references job_applications)
      - `date` (timestamptz)
      - `type` (text)
      - `location` (text)
      - `contact_name` (text)
      - `contact_email` (text)
      - `notes` (text)
      - `reminder_set` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create job interviews table
CREATE TABLE job_interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_application_id uuid REFERENCES job_applications(id) ON DELETE CASCADE NOT NULL,
  date timestamptz NOT NULL,
  type text NOT NULL CHECK (type IN ('phone', 'technical', 'hr', 'final', 'other')),
  location text,
  contact_name text,
  contact_email text,
  notes text,
  reminder_set boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE job_interviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own interviews"
  ON job_interviews
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to send interview reminders
CREATE OR REPLACE FUNCTION send_interview_reminders()
RETURNS void
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_interview RECORD;
BEGIN
  -- Find interviews happening in the next 24 hours with reminders enabled
  FOR v_interview IN
    SELECT i.*, p.email, j.title as job_title, c.company
    FROM public.job_interviews i
    JOIN public.profiles p ON p.id = i.user_id
    JOIN public.job_applications a ON a.id = i.job_application_id
    JOIN public.jobs j ON j.id = a.job_id
    JOIN public.companies c ON c.id = j.company_id
    WHERE i.reminder_set = true
      AND i.date > now()
      AND i.date < now() + interval '24 hours'
  LOOP
    -- Insert notification
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      content,
      link
    ) VALUES (
      v_interview.user_id,
      'interview_reminder',
      'Rappel d''entretien',
      format(
        'Rappel: Vous avez un entretien %s pour le poste de %s chez %s le %s à %s',
        v_interview.type,
        v_interview.job_title,
        v_interview.company,
        to_char(v_interview.date, 'DD/MM/YYYY'),
        to_char(v_interview.date, 'HH24:MI')
      ),
      '/applications'
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;