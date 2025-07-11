const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://klwugophjvzctlautsqz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsd3Vnb3BoanZ6Y3RsYXV0c3F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MjMwNzUsImV4cCI6MjA1ODQ5OTA3NX0.LWlKtDvRrlMxswfhJU5nd5OHTUulyN2xgd_bR-hkWiE';
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  const { user, session, error } = await supabase.auth.signInWithPassword({
    email: 'lauboin2@gmail.com',
    password: 'Clement@99'
  });
  console.log({ user, session, error });
})();
