-- Re-enable RLS on cv_data table and create proper policies
-- This fixes the "unrestricted" status seen in Supabase dashboard

-- Enable RLS on cv_data table
ALTER TABLE cv_data ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to see their own CV data
CREATE POLICY "Users can view their own cv_data" ON cv_data
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy for authenticated users to insert their own CV data
CREATE POLICY "Users can insert their own cv_data" ON cv_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for authenticated users to update their own CV data
CREATE POLICY "Users can update their own cv_data" ON cv_data
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy for authenticated users to delete their own CV data
CREATE POLICY "Users can delete their own cv_data" ON cv_data
  FOR DELETE USING (auth.uid() = user_id);