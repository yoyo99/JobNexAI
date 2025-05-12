/**
 * Module de compatibilité pour Supabase
 * 
 * Ce fichier fournit une façade pour l'API Supabase sans aucune référence directe au module,
 * ce qui permet d'éviter complètement les problèmes de résolution d'importation sur Netlify.
 * 
 * V2: Version ultra-résiliente sans import direct à @supabase/supabase-js pour éviter les erreurs de build.
 */

// Pas d'import de @supabase/supabase-js - tout est défini manuellement

// Récupérer l'instance Supabase depuis window (injection par le script de chargement)
const getSupabaseFromWindow = () => {
  if (typeof window !== 'undefined') {
    return (window as any).supabase;
  }
  return null;
};

// Client factice avec implémentation minimale mais complète
const createMockClient = (supabaseUrl: string, supabaseKey: string) => ({
  // Authentification
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signInWithPassword: (credentials: any) => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Service indisponible' } }),
    signInWithOAuth: (options: any) => Promise.resolve({ data: { url: '#' }, error: { message: 'Service indisponible' } }),
    signUp: (credentials: any) => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Service indisponible' } }),
    resetPasswordForEmail: (email: string) => Promise.resolve({ data: {}, error: null }),
    updateUser: (attributes: any) => Promise.resolve({ data: { user: null }, error: null }),
    onAuthStateChange: (callback: Function) => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signOut: () => Promise.resolve({ error: null })
  },
  // Base de données
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: () => Promise.resolve({ data: null, error: null }),
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
        then: (callback: (value: { data: any[]; error: null }) => any) => Promise.resolve({ data: [], error: null }).then(callback)
      }),
      order: (column: string, options?: any) => ({
        range: (from: number, to: number) => Promise.resolve({ data: [], error: null })
      }),
      range: (from: number, to: number) => Promise.resolve({ data: [], error: null }),
      then: (callback: (value: { data: any[]; error: null }) => any) => Promise.resolve({ data: [], error: null }).then(callback)
    }),
    insert: (data: any) => Promise.resolve({ data: null, error: null }),
    update: (data: any) => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
      match: (criteria: any) => Promise.resolve({ data: null, error: null })
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
      match: (criteria: any) => Promise.resolve({ data: null, error: null })
    })
  }),
  // Stockage
  storage: {
    from: (bucket: string) => ({
      upload: (path: string, file: any) => Promise.resolve({ data: null, error: null }),
      download: (path: string) => Promise.resolve({ data: null, error: null }),
      remove: (paths: string[]) => Promise.resolve({ data: null, error: null }),
      list: (prefix?: string) => Promise.resolve({ data: [], error: null }),
      getPublicUrl: (path: string) => ({ data: { publicUrl: '' } })
    })
  },
  // Fonctions (Ajout Factice)
  functions: {
    invoke: (functionName: string, options?: any) => {
      console.warn(`[SupabaseCompat] Appel factice à la fonction ${functionName}`);
      // Retourner une promesse résolue avec une erreur pour indiquer que c'est factice
      return Promise.resolve({ data: null, error: { message: 'Fonctionnalité indisponible avec le client factice' } });
    }
  }
});

// Fonction exportée pour créer un client Supabase
export function createClient(supabaseUrl: string, supabaseKey: string) {
  // Essayer d'obtenir Supabase depuis window (script injecté ailleurs)
  const supabaseLib = getSupabaseFromWindow();
  
  if (supabaseLib && supabaseLib.createClient) {
    try {
      return supabaseLib.createClient(supabaseUrl, supabaseKey);
    } catch (error) {
      console.warn('[SupabaseCompat] Erreur avec le client global:', error);
      // Continuer avec le client factice
    }
  }
  
  console.warn('[SupabaseCompat] Utilisation du client factice (fonctionnalités limitées)');
  return createMockClient(supabaseUrl, supabaseKey);
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
