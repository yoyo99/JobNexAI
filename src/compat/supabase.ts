/**
 * Module de compatibilité pour @supabase/supabase-js
 * 
 * Ce fichier permet de réexporter les éléments de l'API Supabase
 * tout en assurant une compatibilité optimale avec Netlify.
 */

import * as Supabase from '@supabase/supabase-js';

// Réexporter les fonctions et types importants
export const { createClient } = Supabase;

// Réexporter les types
export type {
  SupabaseClient,
  User,
  Session,
  Provider,
  ApiError,
  PostgrestResponse,
  PostgrestSingleResponse,
  PostgrestMaybeSingleResponse,
  PostgrestError
} from '@supabase/supabase-js';

// Exporter le module complet
export default Supabase;
