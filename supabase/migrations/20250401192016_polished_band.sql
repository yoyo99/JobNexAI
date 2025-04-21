-- Mise à jour de la fonction de notification pour inclure plus de détails
CREATE OR REPLACE FUNCTION notify_matching_jobs()
RETURNS trigger AS $$
DECLARE
  v_user record;
  v_match_score numeric;
  v_user_preferences record;
  v_matching_skills text[];
BEGIN
  -- Pour chaque utilisateur ayant des préférences
  FOR v_user IN
    SELECT DISTINCT up.user_id, array_agg(s.name) as skills
    FROM user_preferences up
    JOIN user_skills us ON us.user_id = up.user_id
    JOIN skills s ON s.id = us.skill_id
    WHERE up.job_types && ARRAY[NEW.job_type]::text[]
      OR up.preferred_locations && ARRAY[NEW.location]::text[]
    GROUP BY up.user_id
  LOOP
    -- Vérifier les critères de correspondance
    SELECT *
    INTO v_user_preferences
    FROM user_preferences
    WHERE user_id = v_user.user_id;

    -- Trouver les compétences correspondantes
    SELECT array_agg(s.name)
    INTO v_matching_skills
    FROM job_skills js
    JOIN skills s ON s.id = js.skill_id
    WHERE js.job_id = NEW.id
      AND s.name = ANY(v_user.skills);

    -- Calculer un score basique de correspondance
    v_match_score := 0;
    
    -- Correspondance du type de contrat
    IF NEW.job_type = ANY(v_user_preferences.job_types) THEN
      v_match_score := v_match_score + 25;
    END IF;
    
    -- Correspondance de la localisation
    IF NEW.location = ANY(v_user_preferences.preferred_locations) THEN
      v_match_score := v_match_score + 25;
    END IF;
    
    -- Correspondance du salaire
    IF (v_user_preferences.min_salary IS NULL OR NEW.salary_max >= v_user_preferences.min_salary)
      AND (v_user_preferences.max_salary IS NULL OR NEW.salary_min <= v_user_preferences.max_salary) THEN
      v_match_score := v_match_score + 25;
    END IF;

    -- Correspondance des compétences
    IF array_length(v_matching_skills, 1) > 0 THEN
      v_match_score := v_match_score + 25;
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
        format(
          '%s chez %s - Score de correspondance : %s%%. Compétences correspondantes : %s',
          NEW.title,
          NEW.company,
          v_match_score::integer,
          array_to_string(v_matching_skills, ', ')
        ),
        NEW.url
      );
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;