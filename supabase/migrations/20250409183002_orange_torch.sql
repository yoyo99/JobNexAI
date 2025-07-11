/*
  # Add user_type to profiles table

  1. Changes
    - Add user_type column to profiles table
    - Add check constraint for valid user types
    - Update handle_new_user function to set default user type

  2. Security
    - No changes to RLS policies
*/

-- Add user_type column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS user_type text CHECK (user_type IN ('candidate', 'freelancer', 'recruiter'));

-- Update handle_new_user function to set default user type
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, trial_ends_at, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    (CURRENT_TIMESTAMP + interval '24 hours'),
    'candidate'
  );

  INSERT INTO public.subscriptions (user_id, status, plan)
  VALUES (
    NEW.id,
    'trialing',
    'free'
  );

  RETURN NEW;
END;
$$;