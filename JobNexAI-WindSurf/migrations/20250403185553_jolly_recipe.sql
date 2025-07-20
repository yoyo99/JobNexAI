/*
  # Fix user preferences RLS and initial data creation

  1. Changes
    - Add trigger to create user preferences on user creation
    - Fix RLS policies for user preferences
    - Add upsert policy for initial data creation

  2. Security
    - Ensure proper RLS policies
    - Add security definer to functions
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read their own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update their own preferences" ON user_preferences;

-- Create new policies with proper access control
CREATE POLICY "Users can manage their own preferences"
  ON user_preferences
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user preferences
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, trial_ends_at)
  VALUES (
    NEW.id,
    NEW.email,
    (CURRENT_TIMESTAMP + interval '24 hours')
  );

  -- Create subscription
  INSERT INTO public.subscriptions (user_id, status, plan)
  VALUES (
    NEW.id,
    'trialing',
    'free'
  );

  -- Create user preferences with default values
  INSERT INTO public.user_preferences (
    user_id,
    job_types,
    preferred_locations,
    gdpr_consent,
    data_retention_accepted,
    marketing_consent
  ) VALUES (
    NEW.id,
    '{}',
    '{}',
    false,
    false,
    false
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to safely get or create user preferences
CREATE OR REPLACE FUNCTION get_or_create_user_preferences(user_id uuid)
RETURNS SETOF user_preferences
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO public.user_preferences (
    user_id,
    job_types,
    preferred_locations,
    gdpr_consent,
    data_retention_accepted,
    marketing_consent
  )
  VALUES (
    user_id,
    '{}',
    '{}',
    false,
    false,
    false
  )
  ON CONFLICT (user_id) DO UPDATE
    SET updated_at = now()
  RETURNING *;
END;
$$ LANGUAGE plpgsql;