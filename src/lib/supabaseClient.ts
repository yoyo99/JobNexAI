import { createClient } from '@supabase/supabase-js';

// URL et clé codées en dur pour garantir que nous utilisons le bon projet Supabase
// Cette solution est temporaire pour résoudre les problèmes de variables d'environnement
const HARDCODED_URL = 'https://pqubbqqzkgeosakziwnh.supabase.co';
const HARDCODED_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxdWJicXF6a2dlb3Nha3ppd25oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NTg1ODMsImV4cCI6MjA2NjQzNDU4M30.FdOQOwVJEHdR6pnHlKmculiRV7JMWSfw_Qm4Kpt56Cg';

// On essaie d'abord d'utiliser les variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string || HARDCODED_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string || HARDCODED_ANON_KEY;

// Log pour débogage
console.log('[SupabaseInit] Utilizing correct config:', { 
  url: supabaseUrl,
  key: `${supabaseAnonKey.substring(0, 5)}...${supabaseAnonKey.substring(supabaseAnonKey.length - 5)}` 
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
