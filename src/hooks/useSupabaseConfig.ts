// Fichier spécifique pour gérer la configuration Supabase avec un contournement pour les problèmes de variables d'environnement
import { createClient } from '@supabase/supabase-js';

// URL et clé codées en dur uniquement pour le développement et pour débloquer la situation
const HARDCODED_URL = 'https://pqubbqqzkgeosakziwnh.supabase.co';
const HARDCODED_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxdWJicXF6a2dlb3Nha3ppd25oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NTg1ODMsImV4cCI6MjA2NjQzNDU4M30.FdOQOwVJEHdR6pnHlKmculiRV7JMWSfw_Qm4Kpt56Cg';

// Essayer d'utiliser les variables d'environnement, sinon utiliser les valeurs codées en dur
export const getSupabaseConfig = () => {
  // Tenter de lire les variables d'environnement
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || HARDCODED_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || HARDCODED_ANON_KEY;
  
  console.log('Configuration Supabase utilisée:', { 
    url: supabaseUrl,
    key: `${supabaseAnonKey.substring(0, 5)}...${supabaseAnonKey.substring(supabaseAnonKey.length - 5)}`
  });
  
  return {
    supabaseUrl,
    supabaseAnonKey
  };
};

// Client Supabase singleton
export const createSupabaseClient = () => {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  return createClient(supabaseUrl, supabaseAnonKey);
};

export default createSupabaseClient;
