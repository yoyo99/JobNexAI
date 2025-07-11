/*
  # Fix security issues

  1. Set search_path for all functions
    - Add SET search_path = '' to all functions
    - This prevents search_path manipulation attacks

  2. Add RLS policies for audit_logs
    - Add policies to control access to audit logs
    - Only allow system and admins to access audit data

  3. Update function definitions
    - Make all functions SECURITY DEFINER
    - Add proper schema qualification
*/

-- Add RLS policies for audit_logs
CREATE POLICY "System can access audit logs"
  ON audit_logs
  FOR ALL
  TO service_role
  USING (true);

-- Update function definitions with proper search_path
CREATE OR REPLACE FUNCTION public.search_jobs(search_query text)
RETURNS SETOF jobs
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.jobs
  WHERE search_vector @@ plainto_tsquery('french', search_query)
  ORDER BY ts_rank(search_vector, plainto_tsquery('french', search_query)) DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_job_matches(p_user_id uuid)
RETURNS void
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.job_matches WHERE user_id = p_user_id;
  
  INSERT INTO public.job_matches (user_id, job_id, match_score)
  SELECT 
    p_user_id,
    j.id,
    public.calculate_job_match_score(p_user_id, j.id)
  FROM public.jobs j
  WHERE j.posted_at >= NOW() - interval '30 days';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.set_preferences_expiration()
RETURNS trigger
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.expires_at := NEW.created_at + interval '3 years';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.calculate_job_match_score(p_user_id uuid, p_job_id uuid)
RETURNS numeric
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_skills_match numeric;
  v_location_match boolean;
  v_salary_match boolean;
  v_final_score numeric;
BEGIN
  SELECT 
    COALESCE(
      (
        COUNT(CASE WHEN us.skill_id = js.skill_id AND 
          (js.importance = 'required' AND us.proficiency_level >= 3) OR
          (js.importance = 'preferred' AND us.proficiency_level >= 2) OR
          (js.importance = 'nice_to_have' AND us.proficiency_level >= 1)
        THEN 1 END)::numeric / 
        NULLIF(COUNT(js.skill_id), 0) * 100
      ),
      0
    )
  INTO v_skills_match
  FROM public.job_skills js
  LEFT JOIN public.user_skills us ON us.skill_id = js.skill_id AND us.user_id = p_user_id
  WHERE js.job_id = p_job_id;

  SELECT EXISTS (
    SELECT 1
    FROM public.user_preferences up
    JOIN public.jobs j ON j.location = ANY(up.preferred_locations)
    WHERE up.user_id = p_user_id AND j.id = p_job_id
  ) INTO v_location_match;

  SELECT EXISTS (
    SELECT 1
    FROM public.user_preferences up
    JOIN public.jobs j ON 
      (j.salary_min IS NULL OR j.salary_min >= up.min_salary) AND
      (j.salary_max IS NULL OR j.salary_max <= up.max_salary)
    WHERE up.user_id = p_user_id AND j.id = p_job_id
  ) INTO v_salary_match;

  v_final_score := (
    v_skills_match * 0.6 +
    (CASE WHEN v_location_match THEN 20 ELSE 0 END) +
    (CASE WHEN v_salary_match THEN 20 ELSE 0 END)
  );

  RETURN v_final_score;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.audit_log_changes()
RETURNS trigger
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    old_data,
    new_data,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.cleanup_expired_data()
RETURNS void
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.user_preferences
  WHERE expires_at < NOW();
  
  DELETE FROM public.audit_logs
  WHERE created_at < NOW() - interval '1 year';
  
  DELETE FROM public.job_matches
  WHERE created_at < NOW() - interval '30 days';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_scheduled_deletion_date()
RETURNS trigger
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.scheduled_deletion_date := NEW.created_at + NEW.retention_period;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.log_gdpr_consent_changes()
RETURNS trigger
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.gdpr_consent IS DISTINCT FROM OLD.gdpr_consent THEN
    INSERT INTO public.audit_logs (
      user_id,
      action,
      table_name,
      record_id,
      old_data,
      new_data
    ) VALUES (
      NEW.user_id,
      'GDPR_CONSENT_CHANGE',
      TG_TABLE_NAME,
      NEW.id,
      jsonb_build_object('gdpr_consent', OLD.gdpr_consent),
      jsonb_build_object('gdpr_consent', NEW.gdpr_consent)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_data_deletion_request(p_user_id uuid)
RETURNS void
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.user_preferences WHERE user_id = p_user_id;
  DELETE FROM public.user_skills WHERE user_id = p_user_id;
  DELETE FROM public.job_matches WHERE user_id = p_user_id;
  
  INSERT INTO public.audit_logs (
    user_id,
    action,
    table_name,
    record_id
  ) VALUES (
    p_user_id,
    'DATA_DELETION_REQUEST',
    'users',
    p_user_id
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.process_job_alerts()
RETURNS void
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_alert RECORD;
  v_jobs RECORD;
BEGIN
  FOR v_alert IN
    SELECT *
    FROM public.job_alerts
    WHERE is_active = true
    AND (
      frequency = 'daily'
      OR (frequency = 'weekly' AND (last_sent_at IS NULL OR last_sent_at < now() - interval '7 days'))
    )
  LOOP
    FOR v_jobs IN
      SELECT j.*
      FROM public.jobs j
      WHERE
        (v_alert.keywords = '{}' OR
         EXISTS (
           SELECT 1
           FROM unnest(v_alert.keywords) k
           WHERE j.title ILIKE '%' || k || '%'
              OR j.description ILIKE '%' || k || '%'
         ))
        AND (v_alert.locations = '{}' OR j.location = ANY(v_alert.locations))
        AND (v_alert.job_types = '{}' OR j.job_type = ANY(v_alert.job_types))
        AND (
          v_alert.salary_min IS NULL
          OR v_alert.salary_max IS NULL
          OR (j.salary_min >= v_alert.salary_min AND j.salary_max <= v_alert.salary_max)
        )
        AND (
          v_alert.frequency = 'weekly'
          OR j.created_at > now() - interval '1 day'
        )
    LOOP
      INSERT INTO public.audit_logs (
        user_id,
        action,
        table_name,
        record_id,
        new_data
      ) VALUES (
        v_alert.user_id,
        'JOB_ALERT_MATCH',
        'jobs',
        v_jobs.id,
        jsonb_build_object(
          'alert_id', v_alert.id,
          'job_id', v_jobs.id,
          'job_title', v_jobs.title
        )
      );
    END LOOP;

    UPDATE public.job_alerts
    SET last_sent_at = now()
    WHERE id = v_alert.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.jobs_search_update()
RETURNS trigger
SECURITY DEFINER
SET search_path = ''
AS $$
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

CREATE OR REPLACE FUNCTION public.update_job_suggestions()
RETURNS trigger
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  PERFORM public.calculate_job_suggestions(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.notify_matching_jobs()
RETURNS trigger
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user record;
  v_match_score numeric;
  v_user_preferences record;
  v_matching_skills text[];
BEGIN
  FOR v_user IN
    SELECT DISTINCT up.user_id, array_agg(s.name) as skills
    FROM public.user_preferences up
    JOIN public.user_skills us ON us.user_id = up.user_id
    JOIN public.skills s ON s.id = us.skill_id
    WHERE up.job_types && ARRAY[NEW.job_type]::text[]
      OR up.preferred_locations && ARRAY[NEW.location]::text[]
    GROUP BY up.user_id
  LOOP
    SELECT *
    INTO v_user_preferences
    FROM public.user_preferences
    WHERE user_id = v_user.user_id;

    SELECT array_agg(s.name)
    INTO v_matching_skills
    FROM public.job_skills js
    JOIN public.skills s ON s.id = js.skill_id
    WHERE js.job_id = NEW.id
      AND s.name = ANY(v_user.skills);

    v_match_score := 0;
    
    IF NEW.job_type = ANY(v_user_preferences.job_types) THEN
      v_match_score := v_match_score + 25;
    END IF;
    
    IF NEW.location = ANY(v_user_preferences.preferred_locations) THEN
      v_match_score := v_match_score + 25;
    END IF;
    
    IF (v_user_preferences.min_salary IS NULL OR NEW.salary_max >= v_user_preferences.min_salary)
      AND (v_user_preferences.max_salary IS NULL OR NEW.salary_min <= v_user_preferences.max_salary) THEN
      v_match_score := v_match_score + 25;
    END IF;

    IF array_length(v_matching_skills, 1) > 0 THEN
      v_match_score := v_match_score + 25;
    END IF;

    IF v_match_score >= 50 THEN
      INSERT INTO public.notifications (
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

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.notify_application_status_change()
RETURNS trigger
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.status != OLD.status THEN
    INSERT INTO public.notifications (
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
    FROM public.jobs j
    WHERE j.id = NEW.job_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;