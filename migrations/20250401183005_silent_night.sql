/*
  # Mise à jour du calcul des suggestions d'emploi

  1. Modifications
    - Amélioration de la fonction calculate_job_suggestions pour prendre en compte l'importance des compétences
    - Ajout de poids différents pour les compétences requises (60%) et préférées (40%)

  2. Changements
    - Modification de la logique de calcul du score de correspondance
    - Optimisation des performances avec des agrégations
*/

-- Mise à jour de la fonction de calcul des suggestions
CREATE OR REPLACE FUNCTION calculate_job_suggestions(p_user_id uuid)
RETURNS void AS $$
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
  FROM user_skills us
  JOIN skills s ON s.id = us.skill_id
  WHERE us.user_id = p_user_id;

  -- Supprimer les anciennes suggestions
  DELETE FROM job_suggestions WHERE user_id = p_user_id;

  -- Pour chaque offre d'emploi
  FOR v_job IN
    SELECT 
      j.id,
      array_agg(s.name) FILTER (WHERE js.importance = 'required') as required_skills,
      array_agg(s.name) FILTER (WHERE js.importance = 'preferred') as preferred_skills
    FROM jobs j
    LEFT JOIN job_skills js ON js.job_id = j.id
    LEFT JOIN skills s ON s.id = js.skill_id
    WHERE j.created_at >= NOW() - INTERVAL '30 days'
    GROUP BY j.id
  LOOP
    -- Calculer le score pour les compétences requises (60% du score total)
    v_required_match := COALESCE((
      SELECT COUNT(*) * 60.0 / NULLIF(array_length(v_job.required_skills, 1), 0)
      FROM unnest(v_user_skills) us
      WHERE us = ANY(v_job.required_skills)
    ), 0);

    -- Calculer le score pour les compétences préférées (40% du score total)
    v_preferred_match := COALESCE((
      SELECT COUNT(*) * 40.0 / NULLIF(array_length(v_job.preferred_skills, 1), 0)
      FROM unnest(v_user_skills) us
      WHERE us = ANY(v_job.preferred_skills)
    ), 0);

    -- Score total
    v_match_score := v_required_match + v_preferred_match;

    -- Sauvegarder la suggestion si le score est supérieur à 0
    IF v_match_score > 0 THEN
      INSERT INTO job_suggestions (user_id, job_id, match_score)
      VALUES (p_user_id, v_job.id, v_match_score);
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;