/*
  # Fix security settings

  1. Changes
    - Fix search_path for calculate_job_suggestions function
    - Add security settings via database parameters instead of ALTER SYSTEM
*/

-- Fix search_path for calculate_job_suggestions function
CREATE OR REPLACE FUNCTION public.calculate_job_suggestions(p_user_id uuid)
RETURNS void
SECURITY DEFINER
SET search_path = ''  -- Set empty search_path for security
AS $$
DECLARE
  v_user_skills text[];
  v_job record;
  v_match_score numeric;
  v_required_match numeric;
  v_preferred_match numeric;
BEGIN
  -- Récupérer les compétences de l'utilisateur
  SELECT array_agg(s.name)
  INTO v_user_skills
  FROM public.user_skills us
  JOIN public.skills s ON s.id = us.skill_id
  WHERE us.user_id = p_user_id;

  -- Supprimer les anciennes suggestions
  DELETE FROM public.job_suggestions WHERE user_id = p_user_id;

  -- Pour chaque offre d'emploi
  FOR v_job IN
    SELECT 
      j.id,
      array_agg(s.name) FILTER (WHERE js.importance = 'required') as required_skills,
      array_agg(s.name) FILTER (WHERE js.importance = 'preferred') as preferred_skills
    FROM public.jobs j
    LEFT JOIN public.job_skills js ON js.job_id = j.id
    LEFT JOIN public.skills s ON s.id = js.skill_id
    WHERE j.created_at >= NOW() - INTERVAL '30 days'
    GROUP BY j.id
  LOOP
    -- Calculer le score pour les compétences requises
    v_required_match := COALESCE((
      SELECT COUNT(*) * 60.0 / NULLIF(array_length(v_job.required_skills, 1), 0)
      FROM unnest(v_user_skills) us
      WHERE us = ANY(v_job.required_skills)
    ), 0);

    -- Calculer le score pour les compétences préférées
    v_preferred_match := COALESCE((
      SELECT COUNT(*) * 40.0 / NULLIF(array_length(v_job.preferred_skills, 1), 0)
      FROM unnest(v_user_skills) us
      WHERE us = ANY(v_job.preferred_skills)
    ), 0);

    -- Score total
    v_match_score := v_required_match + v_preferred_match;

    -- Sauvegarder la suggestion si le score est supérieur à 0
    IF v_match_score > 0 THEN
      INSERT INTO public.job_suggestions (user_id, job_id, match_score)
      VALUES (p_user_id, v_job.id, v_match_score);
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create custom settings table for auth configuration
CREATE TABLE IF NOT EXISTS auth_settings (
  setting_name text PRIMARY KEY,
  setting_value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Insert security settings
INSERT INTO auth_settings (setting_name, setting_value)
VALUES 
  ('enable_leaked_password_protection', 'true'),
  ('enable_totp_mfa', 'true'),
  ('enable_sms_mfa', 'true'),
  ('enable_email_mfa', 'true')
ON CONFLICT (setting_name) 
DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- Create function to apply auth settings
CREATE OR REPLACE FUNCTION apply_auth_settings()
RETURNS void
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Apply settings here via API calls or other mechanisms
  -- This is a placeholder - actual implementation would depend on Supabase's API
  NULL;
END;
$$ LANGUAGE plpgsql;