/*
  # Update job types and add indexes

  1. Changes
    - Add check constraint for job_type values
    - Add indexes for frequently queried columns
    - Add full text search index for job search

  2. Security
    - No changes to RLS policies
*/

-- Add check constraint for job types
ALTER TABLE jobs ADD CONSTRAINT jobs_job_type_check 
  CHECK (job_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP'));

-- Add indexes for frequently queried columns
CREATE INDEX jobs_posted_at_idx ON jobs (posted_at DESC);
CREATE INDEX jobs_job_type_idx ON jobs (job_type);
CREATE INDEX jobs_location_idx ON jobs (location);

-- Add full text search capabilities
ALTER TABLE jobs ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('french', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('french', coalesce(company, '')), 'B') ||
    setweight(to_tsvector('french', coalesce(description, '')), 'C')
  ) STORED;

CREATE INDEX jobs_search_idx ON jobs USING gin(search_vector);

-- Update the jobs table to use text search in the search policy
CREATE OR REPLACE FUNCTION search_jobs(search_query text)
RETURNS SETOF jobs AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM jobs
  WHERE search_vector @@ plainto_tsquery('french', search_query)
  ORDER BY ts_rank(search_vector, plainto_tsquery('french', search_query)) DESC;
END;
$$ LANGUAGE plpgsql;