import { createClient } from '@supabase/supabase-js';

// Types pour TypeScript
export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
}

let supabaseInstance: ReturnType<typeof createClient> | null = null;

/**
 * Récupère une instance du client Supabase singleton
 */
export function getSupabaseClient() {
  if (!supabaseInstance) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Les variables d\'environnement Supabase sont manquantes');
    }

    supabaseInstance = createClient(supabaseUrl, supabaseKey);
  }
  
  return supabaseInstance;
}

/**
 * Récupère l'utilisateur actuellement connecté
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getUser();
  
  if (error || !data?.user) {
    return null;
  }
  
  return data.user as AuthUser;
}

/**
 * Récupère la session actuelle
 */
export async function getCurrentSession() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getSession();
  
  if (error || !data?.session) {
    return null;
  }
  
  return data.session;
}

/**
 * Connexion avec email et mot de passe
 */
export async function signInWithEmail(email: string, password: string) {
  const supabase = getSupabaseClient();
  return await supabase.auth.signInWithPassword({ email, password });
}

/**
 * Inscription avec email et mot de passe
 */
export async function signUpWithEmail(email: string, password: string) {
  const supabase = getSupabaseClient();
  return await supabase.auth.signUp({ email, password });
}

/**
 * Déconnexion
 */
export async function signOut() {
  const supabase = getSupabaseClient();
  return await supabase.auth.signOut();
}

/**
 * Réinitialisation du mot de passe
 */
export async function resetPassword(email: string) {
  const supabase = getSupabaseClient();
  return await supabase.auth.resetPasswordForEmail(email);
}

/**
 * Met à jour le mot de passe de l'utilisateur
 */
export async function updatePassword(password: string) {
  const supabase = getSupabaseClient();
  return await supabase.auth.updateUser({ password });
}

/**
 * S'abonne aux changements d'authentification
 */
export function onAuthStateChange(callback: (event: 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED' | 'PASSWORD_RECOVERY', session: any) => void) {
  const supabase = getSupabaseClient();
  
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event as any, session);
  });
}
