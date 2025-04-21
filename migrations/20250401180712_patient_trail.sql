/*
  # Ajout des suggestions d'emploi personnalisées

  1. Nouvelles Tables
    - `job_suggestions` : Stocke les suggestions d'emploi pour chaque utilisateur
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `job_id` (uuid, foreign key)
      - `match_score` (numeric)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `job_suggestions`
    - Add policy for authenticated users to read their own suggestions
*/

-- Création de la table des suggestions
CREATE TABLE job_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  match_score numeric NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, job_id)
);

-- Activation de RLS
ALTER TABLE job_suggestions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read their own suggestions"
  ON job_suggestions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Index pour améliorer les performances
CREATE INDEX job_suggestions_user_id_idx ON job_suggestions (user_id);
CREATE INDEX job_suggestions_job_id_idx ON job_suggestions (job_id);
CREATE INDEX job_suggestions_match_score_idx ON job_suggestions (match_score DESC);

-- Fonction pour calculer les suggestions
CREATE OR REPLACE FUNCTION calculate_job_suggestions(p_user_id uuid)
RETURNS void AS $$
DECLARE
  v_user_skills text[];
  v_job record;
  v_job_skills text[];
  v_match_score numeric;
BEGIN
  -- Récupérer les compétences de l'utilisateur
  SELECT array_agg(s.name)
  INTO v_user_skills
  FROM user_skills us
  JOIN skills s ON s.id = us.skill_id
  WHERE us.user_id = p_user_id;

  -- Supprimer les anciennes suggestions
  DELETE FROM job_suggestions WHERE user_id = p_user_id;

  -- Pour chaque offre d'emploi
  FOR v_job IN
    SELECT j.id, array_agg(s.name) as skills
    FROM jobs j
    LEFT JOIN job_skills js ON js.job_id = j.id
    LEFT JOIN skills s ON s.id = js.skill_id
    WHERE j.created_at >= NOW() - INTERVAL '30 days'
    GROUP BY j.id
  LOOP
    -- Calculer le score de correspondance
    v_match_score := (
      SELECT COUNT(*) * 100.0 / GREATEST(array_length(v_job.skills, 1), 1)
      FROM unnest(v_user_skills) us
      WHERE us = ANY(v_job.skills)
    );

    -- Sauvegarder la suggestion si le score est supérieur à 0
    IF v_match_score > 0 THEN
      INSERT INTO job_suggestions (user_id, job_id, match_score)
      VALUES (p_user_id, v_job.id, v_match_score);
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour recalculer les suggestions quand les compétences changent
CREATE OR REPLACE FUNCTION update_job_suggestions()
RETURNS trigger AS $$
BEGIN
  PERFORM calculate_job_suggestions(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_job_suggestions_trigger
AFTER INSERT OR UPDATE OR DELETE ON user_skills
FOR EACH ROW
EXECUTE FUNCTION update_job_suggestions();