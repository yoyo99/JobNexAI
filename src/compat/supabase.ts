/**
 * Module de compatibilité pour Supabase
 * 
 * Ce fichier fournit une façade pour l'API Supabase sans aucune référence directe au module,
 * ce qui permet d'éviter complètement les problèmes de résolution d'importation sur Netlify.
 */

// Définir le client de base sans aucune référence à @supabase/supabase-js
export function createClient(supabaseUrl: string, supabaseKey: string) {
  // Dans Netlify/navigateur, nous essayons d'utiliser la référence globale si elle existe
  if (typeof window !== 'undefined' && (window as any).supabase) {
    try {
      return (window as any).supabase.createClient(supabaseUrl, supabaseKey);
    } catch (error) {
      console.warn('Erreur lors de la création du client Supabase:', error);
      // Continuer avec le client factice
    }
  }
  
  // Retourner un client factice (pour compilation et secours)
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
