/*
  # Ajout des notifications

  1. Nouvelle Table
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `type` (text) - Type de notification (new_job, match_update, etc.)
      - `title` (text) - Titre de la notification
      - `content` (text) - Contenu détaillé
      - `link` (text) - Lien optionnel
      - `read` (boolean) - État de lecture
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `notifications` table
    - Add policy for authenticated users to read their own notifications
    - Add policy for system to create notifications

  3. Triggers
    - Add trigger to create notifications for new matching jobs
*/

-- Création de la table des notifications
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('new_job', 'match_update', 'favorite_update')),
  title text NOT NULL,
  content text,
  link text,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Activation de RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can mark their notifications as read"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Index pour améliorer les performances
CREATE INDEX notifications_user_id_idx ON notifications (user_id);
CREATE INDEX notifications_created_at_idx ON notifications (created_at DESC);
CREATE INDEX notifications_read_idx ON notifications (read);

-- Fonction pour créer des notifications pour les nouveaux emplois correspondants
CREATE OR REPLACE FUNCTION notify_matching_jobs()
RETURNS trigger AS $$
DECLARE
  v_user record;
  v_match_score numeric;
  v_user_preferences record;
BEGIN
  -- Pour chaque utilisateur ayant des préférences
  FOR v_user IN
    SELECT DISTINCT up.user_id
    FROM user_preferences up
    WHERE up.job_types && ARRAY[NEW.job_type]::text[]
      OR up.preferred_locations && ARRAY[NEW.location]::text[]
  LOOP
    -- Vérifier les critères de correspondance
    SELECT *
    INTO v_user_preferences
    FROM user_preferences
    WHERE user_id = v_user.user_id;

    -- Calculer un score basique de correspondance
    v_match_score := 0;
    
    -- Correspondance du type de contrat
    IF NEW.job_type = ANY(v_user_preferences.job_types) THEN
      v_match_score := v_match_score + 33.33;
    END IF;
    
    -- Correspondance de la localisation
    IF NEW.location = ANY(v_user_preferences.preferred_locations) THEN
      v_match_score := v_match_score + 33.33;
    END IF;
    
    -- Correspondance du salaire
    IF (v_user_preferences.min_salary IS NULL OR NEW.salary_max >= v_user_preferences.min_salary)
      AND (v_user_preferences.max_salary IS NULL OR NEW.salary_min <= v_user_preferences.max_salary) THEN
      v_match_score := v_match_score + 33.34;
    END IF;

    -- Si le score est supérieur à 50%, créer une notification
    IF v_match_score >= 50 THEN
      INSERT INTO notifications (
        user_id,
        type,
        title,
        content,
        link
      ) VALUES (
        v_user.user_id,
        'new_job',
        'Nouvelle offre correspondant à vos critères',
        format('%s chez %s - Score de correspondance : %s%%', NEW.title, NEW.company, v_match_score::integer),
        NEW.url
      );
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour les nouvelles offres
CREATE TRIGGER notify_matching_jobs_trigger
AFTER INSERT ON jobs
FOR EACH ROW
EXECUTE FUNCTION notify_matching_jobs();