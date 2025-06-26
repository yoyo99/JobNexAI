import { createClient } from '@supabase/supabase-js';

// URL et clé codées en dur pour le projet Supabase de production
// Ces valeurs sont prioritaires et ne dépendent plus des variables d'environnement
const SUPABASE_URL = 'https://pqubbqqzkgeosakziwnh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxdWJicXF6a2dlb3Nha3ppd25oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NTg1ODMsImV4cCI6MjA2NjQzNDU4M30.FdOQOwVJEHdR6pnHlKmculiRV7JMWSfw_Qm4Kpt56Cg';

// Log pour confirmer l'utilisation des valeurs codées en dur
console.log('[SupabaseInit] Using hardcoded Supabase configuration:', { 
  url: SUPABASE_URL,
  key: `${SUPABASE_ANON_KEY.substring(0, 5)}...${SUPABASE_ANON_KEY.substring(SUPABASE_ANON_KEY.length - 5)}`
});

// Création du client Supabase avec les valeurs codées en dur
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
