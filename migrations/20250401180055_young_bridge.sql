/*
  # Ajout de la table des favoris

  1. Nouvelle Table
    - `job_favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key vers auth.users)
      - `job_id` (uuid, foreign key vers jobs)
      - `notes` (text, optionnel)
      - `created_at` (timestamp)

  2. Sécurité
    - Enable RLS
    - Policies pour la gestion des favoris
*/

-- Création de la table des favoris
CREATE TABLE job_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, job_id)
);

-- Activation de RLS
ALTER TABLE job_favorites ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own favorites"
  ON job_favorites
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Index pour améliorer les performances
CREATE INDEX job_favorites_user_id_idx ON job_favorites (user_id);
CREATE INDEX job_favorites_job_id_idx ON job_favorites (job_id);