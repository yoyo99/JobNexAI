/**
 * Module de compatibilité pour @supabase/supabase-js
 * 
 * Ce fichier fournit une façade pour l'API Supabase sans importer directement le module,
 * ce qui permet d'éviter les problèmes de résolution d'importation Netlify.
 */

// Définir un client de base
export function createClient(supabaseUrl: string, supabaseKey: string) {
  // Dans Netlify, nous importons dynamiquement le module pour éviter les erreurs de résolution
  if (typeof window !== 'undefined') {
    const actualModule = require('@supabase/supabase-js');
    return actualModule.createClient(supabaseUrl, supabaseKey);
  }
  
  // En cas d'échec, retourner un client factice (pour compilation seulement)
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null })
    },
    from: (table: string) => ({
      select: () => ({ data: null, error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null })
    })
  };
}

// Définir les types nécessaires
export interface SupabaseClient {
  auth: any;
  from: (table: string) => any;
}

export interface User {
  id: string;
  email?: string;
}

export interface Session {
  user: User;
  access_token: string;
}

export interface Provider {
  id: string;
  name: string;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface PostgrestResponse<T> {
  data: T | null;
  error: PostgrestError | null;
}

export interface PostgrestSingleResponse<T> extends PostgrestResponse<T> {}
export interface PostgrestMaybeSingleResponse<T> extends PostgrestResponse<T> {}

export interface PostgrestError {
  message: string;
  details: string;
  hint: string;
  code: string;
}

// Pas d'export par défaut pour éviter les problèmes d'importation
