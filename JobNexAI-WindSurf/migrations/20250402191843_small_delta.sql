/*
  # Fix function search path security issue

  1. Changes
    - Add SECURITY DEFINER to function
    - Set search_path explicitly to empty string
    - Update function to use fully qualified table names
*/

-- Drop existing function and trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate function with proper security settings
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''  -- Set empty search_path for security
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, trial_ends_at)
  VALUES (
    NEW.id,
    NEW.email,
    (CURRENT_TIMESTAMP + interval '24 hours')
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

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();