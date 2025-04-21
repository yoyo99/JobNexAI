/*
  # Ajout des favoris d'offres d'emploi

  1. Vérification et création de la table
    - Vérifie si la table job_favorites existe déjà
    - Crée la table si elle n'existe pas
    - Ajoute les contraintes et index nécessaires

  2. Sécurité
    - Active RLS sur la table
    - Ajoute une policy pour la gestion des favoris

  3. Performance
    - Ajoute des index pour optimiser les requêtes
*/

DO $$ 
BEGIN
  -- Vérifier si la table n'existe pas déjà
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'job_favorites') THEN
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
  END IF;
END $$;