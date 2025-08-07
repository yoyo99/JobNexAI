-- Create permissive policies for the 'cvs' bucket for testing purposes
-- This is safer than disabling RLS on the entire storage.objects table.

CREATE POLICY "Allow ALL on cvs bucket for anon" ON storage.objects
  FOR ALL
  TO anon
  USING (bucket_id = 'cvs');

CREATE POLICY "Allow ALL on cvs bucket for authenticated" ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'cvs');

CREATE POLICY "Allow ALL on cvs bucket for service_role" ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'cvs');