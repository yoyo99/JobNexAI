/*
  # Add CV table and related functions

  1. New Table
    - `user_cvs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `content` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for users to manage their CVs
*/

-- Create CV table
CREATE TABLE user_cvs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_cvs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own CVs"
  ON user_cvs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create trigger to update updated_at
CREATE TRIGGER update_user_cvs_updated_at
  BEFORE UPDATE
  ON user_cvs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to export CV as PDF (placeholder)
CREATE OR REPLACE FUNCTION export_cv_as_pdf(p_user_id uuid)
RETURNS text
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- This is a placeholder. The actual PDF generation would be handled by an Edge Function
  RETURN 'pdf_url';
END;
$$ LANGUAGE plpgsql;