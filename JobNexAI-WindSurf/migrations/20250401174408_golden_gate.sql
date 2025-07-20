/*
  # Ajout de champs pour la recherche avancée d'emplois

  1. Nouveaux champs
    - `remote_type` : Type de travail à distance (remote, hybrid, onsite)
    - `experience_level` : Niveau d'expérience requis (junior, mid, senior)

  2. Mise à jour des index
    - Ajout d'index sur les nouveaux champs pour optimiser les recherches
*/

-- Ajout des nouveaux champs
ALTER TABLE jobs
ADD COLUMN remote_type text CHECK (remote_type IN ('remote', 'hybrid', 'onsite')),
ADD COLUMN experience_level text CHECK (experience_level IN ('junior', 'mid', 'senior'));

-- Création des index
CREATE INDEX jobs_remote_type_idx ON jobs (remote_type);
CREATE INDEX jobs_experience_level_idx ON jobs (experience_level);
CREATE INDEX jobs_salary_max_idx ON jobs (salary_max DESC);

-- Mise à jour de la fonction de recherche vectorielle
CREATE OR REPLACE FUNCTION jobs_search_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('french', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('french', COALESCE(NEW.company, '')), 'B') ||
    setweight(to_tsvector('french', COALESCE(NEW.description, '')), 'C') ||
    setweight(to_tsvector('french', COALESCE(NEW.remote_type, '')), 'D') ||
    setweight(to_tsvector('french', COALESCE(NEW.experience_level, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;