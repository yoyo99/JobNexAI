/*
  # Ajout de l'analyse IA pour le matching

  1. Modifications
    - Ajout de la colonne ai_analysis à la table job_matches
    - Mise à jour des triggers pour le matching
*/

-- Ajouter la colonne pour l'analyse IA
ALTER TABLE job_matches
ADD COLUMN IF NOT EXISTS ai_analysis jsonb;

-- Mettre à jour la fonction de calcul des suggestions
CREATE OR REPLACE FUNCTION calculate_job_suggestions(p_user_id uuid)
RETURNS void
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_job record;
  v_match_score numeric;
  v_analysis jsonb;
BEGIN
  -- Supprimer les anciennes suggestions
  DELETE FROM public.job_suggestions WHERE user_id = p_user_id;

  -- Pour chaque offre d'emploi récente
  FOR v_job IN
    SELECT id
    FROM public.jobs
    WHERE created_at >= NOW() - INTERVAL '30 days'
  LOOP
    -- Appeler la fonction Edge pour l'analyse IA
    -- Note: Cette partie est gérée par le code applicatif
    -- car les Edge Functions ne peuvent pas être appelées directement depuis PL/pgSQL

    -- Sauvegarder la suggestion si un score existe
    INSERT INTO public.job_suggestions (
      user_id,
      job_id,
      match_score,
      created_at
    )
    SELECT
      p_user_id,
      v_job.id,
      COALESCE(jm.match_score, 0),
      NOW()
    FROM public.job_matches jm
    WHERE jm.user_id = p_user_id
      AND jm.job_id = v_job.id
      AND jm.match_score > 0;
  END LOOP;
END;
$$ LANGUAGE plpgsql;