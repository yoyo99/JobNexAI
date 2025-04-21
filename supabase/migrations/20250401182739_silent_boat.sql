/*
  # Création de la table des candidatures

  1. Nouvelle Table
    - `job_applications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `job_id` (uuid, foreign key)
      - `status` (text)
      - `notes` (text)
      - `applied_at` (timestamptz)
      - `next_step_date` (timestamptz)
      - `next_step_type` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Création de la table des candidatures
CREATE TABLE job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('draft', 'applied', 'interviewing', 'offer', 'rejected', 'accepted', 'withdrawn')),
  notes text,
  applied_at timestamptz,
  next_step_date timestamptz,
  next_step_type text CHECK (next_step_type IN ('phone', 'technical', 'hr', 'final', 'other')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, job_id)
);

-- Activation de RLS
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own applications"
  ON job_applications
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Index pour améliorer les performances
CREATE INDEX job_applications_user_id_idx ON job_applications (user_id);
CREATE INDEX job_applications_job_id_idx ON job_applications (job_id);
CREATE INDEX job_applications_status_idx ON job_applications (status);
CREATE INDEX job_applications_next_step_date_idx ON job_applications (next_step_date);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE
  ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour créer une notification lors d'un changement de statut
CREATE OR REPLACE FUNCTION notify_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status != OLD.status THEN
    INSERT INTO notifications (
      user_id,
      type,
      title,
      content,
      link
    )
    SELECT
      NEW.user_id,
      'application_update',
      CASE NEW.status
        WHEN 'interviewing' THEN 'Entretien programmé'
        WHEN 'offer' THEN 'Offre reçue'
        WHEN 'rejected' THEN 'Candidature refusée'
        WHEN 'accepted' THEN 'Offre acceptée'
        ELSE 'Statut de candidature mis à jour'
      END,
      'Votre candidature pour ' || j.title || ' chez ' || j.company || ' a été mise à jour.',
      j.url
    FROM jobs j
    WHERE j.id = NEW.job_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notify_application_status_change_trigger
  AFTER UPDATE OF status
  ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION notify_application_status_change();