/*
  # Add GDPR and data retention fields

  1. Changes
    - Add GDPR consent fields to user_preferences
    - Add data retention fields to audit_logs
    - Add data processing fields to job_matches
    - Update RLS policies for GDPR compliance
    - Add triggers for GDPR consent logging

  2. Security
    - Add policy requiring GDPR consent for data access
    - Add audit logging for consent changes
    - Add data deletion request handler
*/

-- Add GDPR fields to user_preferences
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS gdpr_consent boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS gdpr_consent_date timestamptz,
ADD COLUMN IF NOT EXISTS data_retention_accepted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS marketing_consent boolean DEFAULT false;

-- Add data retention fields to audit_logs
ALTER TABLE audit_logs 
ADD COLUMN IF NOT EXISTS retention_period interval DEFAULT interval '1 year',
ADD COLUMN IF NOT EXISTS scheduled_deletion_date timestamptz;

-- Create function to update scheduled_deletion_date
CREATE OR REPLACE FUNCTION update_scheduled_deletion_date()
RETURNS trigger AS $$
BEGIN
  -- Calculate scheduled deletion date based on retention period
  NEW.scheduled_deletion_date := NEW.created_at + NEW.retention_period;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update scheduled_deletion_date
DROP TRIGGER IF EXISTS update_scheduled_deletion_date_trigger ON audit_logs;
CREATE TRIGGER update_scheduled_deletion_date_trigger
  BEFORE INSERT OR UPDATE ON audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_scheduled_deletion_date();

-- Add data processing fields to job_matches
ALTER TABLE job_matches 
ADD COLUMN IF NOT EXISTS data_processing_consent boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS processing_purpose text DEFAULT 'job_matching',
ADD COLUMN IF NOT EXISTS data_source text DEFAULT 'user_input';

-- Drop existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can read their own matches" ON job_matches;
  DROP POLICY IF EXISTS "Users can read their own matches with consent" ON job_matches;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create new policy with GDPR consent check
CREATE POLICY "Users can read their own matches with consent"
ON job_matches
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM user_preferences
    WHERE user_id = auth.uid()
    AND gdpr_consent = true
  )
);

-- Create function to log GDPR consent changes
CREATE OR REPLACE FUNCTION log_gdpr_consent_changes()
RETURNS trigger AS $$
BEGIN
  IF NEW.gdpr_consent IS DISTINCT FROM OLD.gdpr_consent THEN
    INSERT INTO audit_logs (
      user_id,
      action,
      table_name,
      record_id,
      old_data,
      new_data
    ) VALUES (
      NEW.user_id,
      'GDPR_CONSENT_CHANGE',
      TG_TABLE_NAME,
      NEW.id,
      jsonb_build_object('gdpr_consent', OLD.gdpr_consent),
      jsonb_build_object('gdpr_consent', NEW.gdpr_consent)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for GDPR consent changes
DROP TRIGGER IF EXISTS log_gdpr_consent_changes ON user_preferences;
CREATE TRIGGER log_gdpr_consent_changes
  AFTER UPDATE OF gdpr_consent ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION log_gdpr_consent_changes();

-- Create function to handle data deletion requests
CREATE OR REPLACE FUNCTION handle_data_deletion_request(p_user_id uuid)
RETURNS void AS $$
BEGIN
  -- Delete user preferences
  DELETE FROM user_preferences WHERE user_id = p_user_id;
  
  -- Delete user skills
  DELETE FROM user_skills WHERE user_id = p_user_id;
  
  -- Delete job matches
  DELETE FROM job_matches WHERE user_id = p_user_id;
  
  -- Log deletion request
  INSERT INTO audit_logs (
    user_id,
    action,
    table_name,
    record_id
  ) VALUES (
    p_user_id,
    'DATA_DELETION_REQUEST',
    'users',
    p_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;