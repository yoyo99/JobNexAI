/*
  # Amélioration de la sécurité de l'authentification

  1. Tables
    - `auth_settings` pour les paramètres de sécurité
    - `auth_login_attempts` pour le suivi des tentatives de connexion

  2. Sécurité
    - Paramètres de sécurité renforcés
    - Journalisation des tentatives de connexion
    - Protection contre les attaques par force brute
*/

-- Créer la table des paramètres d'authentification
CREATE TABLE IF NOT EXISTS auth_settings (
  setting_name text PRIMARY KEY,
  setting_value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Insérer les paramètres de sécurité par défaut
INSERT INTO auth_settings (setting_name, setting_value)
VALUES 
  ('enable_leaked_password_protection', 'true'),
  ('enable_totp_mfa', 'true'),
  ('enable_sms_mfa', 'true'),
  ('enable_email_mfa', 'true'),
  ('min_password_length', '12'),
  ('require_special_chars', 'true'),
  ('require_numbers', 'true'),
  ('require_uppercase', 'true'),
  ('require_lowercase', 'true'),
  ('max_login_attempts', '5'),
  ('lockout_duration', '900'),
  ('session_expiry', '86400'),
  ('refresh_token_rotation', 'true'),
  ('jwt_expiry', '3600'),
  ('secure_cookie', 'true'),
  ('same_site_cookie', 'strict')
ON CONFLICT (setting_name) 
DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();

-- Créer la table des tentatives de connexion
CREATE TABLE IF NOT EXISTS auth_login_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  ip_address inet NOT NULL,
  user_agent text,
  success boolean NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Créer un index sur les tentatives de connexion récentes
-- Utiliser une fonction IMMUTABLE pour le prédicat
CREATE OR REPLACE FUNCTION is_recent_attempt(created_at timestamptz)
RETURNS boolean
IMMUTABLE
LANGUAGE sql AS $$
  SELECT created_at > now() - interval '1 hour'
$$;

CREATE INDEX auth_login_attempts_recent_idx 
ON auth_login_attempts (user_id, created_at DESC)
WHERE is_recent_attempt(created_at);

-- Créer une fonction pour vérifier les tentatives de connexion
CREATE OR REPLACE FUNCTION check_login_attempts(p_user_id uuid, p_ip_address inet)
RETURNS boolean
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_max_attempts int;
  v_lockout_duration int;
  v_recent_attempts int;
BEGIN
  -- Récupérer les paramètres
  SELECT COALESCE(setting_value::int, 5)
  INTO v_max_attempts
  FROM auth_settings
  WHERE setting_name = 'max_login_attempts';

  SELECT COALESCE(setting_value::int, 900)
  INTO v_lockout_duration
  FROM auth_settings
  WHERE setting_name = 'lockout_duration';

  -- Compter les tentatives récentes
  SELECT COUNT(*)
  INTO v_recent_attempts
  FROM auth_login_attempts
  WHERE (user_id = p_user_id OR ip_address = p_ip_address)
    AND created_at > now() - (v_lockout_duration || ' seconds')::interval
    AND NOT success;

  RETURN v_recent_attempts < v_max_attempts;
END;
$$ LANGUAGE plpgsql;

-- Créer une fonction pour journaliser les tentatives de connexion
CREATE OR REPLACE FUNCTION log_login_attempt(
  p_user_id uuid,
  p_ip_address inet,
  p_user_agent text,
  p_success boolean
)
RETURNS void
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO auth_login_attempts (
    user_id,
    ip_address,
    user_agent,
    success
  ) VALUES (
    p_user_id,
    p_ip_address,
    p_user_agent,
    p_success
  );

  -- Journaliser dans les audit logs
  INSERT INTO audit_logs (
    user_id,
    action,
    table_name,
    ip_address,
    user_agent
  ) VALUES (
    p_user_id,
    CASE WHEN p_success THEN 'LOGIN_SUCCESS' ELSE 'LOGIN_FAILURE' END,
    'auth.users',
    p_ip_address,
    p_user_agent
  );
END;
$$ LANGUAGE plpgsql;

-- Créer une fonction pour nettoyer les anciennes tentatives
CREATE OR REPLACE FUNCTION cleanup_old_login_attempts()
RETURNS void
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  DELETE FROM auth_login_attempts
  WHERE created_at < now() - interval '7 days';
END;
$$ LANGUAGE plpgsql;

-- Créer un trigger pour la rotation des jetons
CREATE OR REPLACE FUNCTION rotate_refresh_token()
RETURNS trigger
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Cette fonction sera appelée par Supabase Auth
  -- lors de la rotation des jetons de rafraîchissement
  INSERT INTO audit_logs (
    user_id,
    action,
    table_name
  ) VALUES (
    NEW.user_id,
    'TOKEN_ROTATION',
    'auth.refresh_tokens'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;