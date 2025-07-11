/*
  # Add job scraping tables

  1. New Tables
    - `job_sources`
      - `id` (uuid, primary key)
      - `name` (text) - Name of the job board
      - `url` (text) - Base URL of the job board
      - `is_active` (boolean) - Whether this source is currently being scraped
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `jobs`
      - `id` (uuid, primary key)
      - `source_id` (uuid, references job_sources)
      - `title` (text) - Job title
      - `company` (text) - Company name
      - `location` (text) - Job location
      - `description` (text) - Full job description
      - `salary_min` (numeric) - Minimum salary if provided
      - `salary_max` (numeric) - Maximum salary if provided
      - `currency` (text) - Salary currency
      - `job_type` (text) - Type of job (full-time, part-time, etc.)
      - `url` (text) - Original job posting URL
      - `posted_at` (timestamptz) - When the job was posted
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read jobs
    - Add policies for system to manage jobs
*/

-- Create job_sources table
CREATE TABLE job_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create jobs table
CREATE TABLE jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid REFERENCES job_sources(id) ON DELETE CASCADE,
  title text NOT NULL,
  company text NOT NULL,
  location text NOT NULL,
  description text,
  salary_min numeric,
  salary_max numeric,
  currency text,
  job_type text NOT NULL,
  url text NOT NULL UNIQUE,
  posted_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE job_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read job sources"
  ON job_sources
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read jobs"
  ON jobs
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert initial job sources
INSERT INTO job_sources (name, url) VALUES
  ('LinkedIn', 'https://www.linkedin.com/jobs'),
  ('Indeed', 'https://www.indeed.com'),
  ('Welcome to the Jungle', 'https://www.welcometothejungle.com/fr/jobs');