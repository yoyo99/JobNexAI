import '../shims/supabase-shim';
import { createClient } from '../compat/supabase';

export const supabase = createClient(
  'https://klwugophjvzctlautsqz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsd3Vnb3BoanZ6Y3RsYXV0c3F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MjMwNzUsImV4cCI6MjA1ODQ5OTA3NX0.LWlKtDvRrlMxswfhJU5nd5OHTUulyN2xgd_bR-hkWiE'
);
