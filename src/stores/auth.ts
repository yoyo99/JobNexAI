import { create } from 'zustand';
import { getSupabase } from '../hooks/useSupabaseConfig';

// --- Type Definitions ---
export interface Profile {
  id: string;
  email?: string;
  full_name?: string;
  user_type?: string;
  is_admin?: boolean;
  trial_ends_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | 'incomplete_expired';
  plan: 'free' | 'pro' | 'enterprise';
  current_period_end: string | null;
  cancel_at: string | null;
  created_at: string;
  updated_at: string;
  stripe_customer_id?: string;
}

// --- State Interface ---
interface AuthState {
  user: Profile | null;
  subscription: Subscription | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  loadUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

// --- Zustand Store ---
export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  subscription: null,
  loading: true,
  error: null,
  initialized: false,

  loadUser: async () => {
    // Ne pas remettre loading à true ici, c'est géré par les appelants
    try {
      const { data: { session } } = await getSupabase().auth.getSession();
      if (!session?.user) {
        // Pas de session, l'initialisation est terminée, pas d'utilisateur.
        set({ user: null, subscription: null, loading: false, initialized: true });
        return;
      }

      const { data: profile, error: profileError } = await getSupabase()
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      // Ignorer l'erreur si aucun profil n'est trouvé (PGRST116: 0 rows)
      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      let subscription: Subscription | null = null;
      if (profile) {
        const { data: subData, error: subError } = await getSupabase()
          .from('subscriptions')
          .select('*')
          .eq('user_id', profile.id)
          .single();
        // Ignorer l'erreur si aucun abonnement n'est trouvé
        if (subError && subError.code !== 'PGRST116') {
          throw subError;
        }
        subscription = subData;
      }
      
      // Succès: mettre à jour l'état et marquer comme initialisé
      set({ user: profile, subscription, loading: false, initialized: true });
    } catch (error: any) {
      console.error('Erreur lors du chargement des données utilisateur:', error);
      // En cas d'erreur, l'initialisation est terminée mais avec une erreur.
      set({ error: error.message, user: null, subscription: null, loading: false, initialized: true });
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { error } = await getSupabase().auth.signInWithPassword({ email, password });
      if (error) throw error;
      // onAuthStateChange s'occupera de lancer loadUser.
      return { error: null };
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return { error };
    }
  },

  signUp: async (email, password, fullName) => {
    set({ loading: true, error: null });
    try {
      const { data, error: signUpError } = await getSupabase().auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (signUpError) throw signUpError;
      if (!data.user) throw new Error("L'inscription a réussi mais aucun utilisateur n'a été retourné.");

      const { error: profileError } = await getSupabase()
        .from('profiles')
        .upsert({
          id: data.user.id,
          email: email,
          full_name: fullName,
          user_type: 'candidate',
          updated_at: new Date().toISOString(),
        });
      if (profileError) throw profileError;
      // onAuthStateChange s'occupera de lancer loadUser.
      return { error: null };
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return { error };
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    try {
      const { error } = await getSupabase().auth.signOut();
      if (error) throw error;
      // Nettoyage simple de l'état. onAuthStateChange fera le reste.
      set({ user: null, subscription: null, loading: false });
      return { error: null };
    } catch (error: any) {
      console.error('Erreur de déconnexion:', error);
      set({ error: error.message, loading: false });
      return { error };
    }
  },

  resetPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      const { error } = await getSupabase().auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) throw error;
      set({ loading: false });
      return { error: null };
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return { error };
    }
  },

  updateProfile: async (updates) => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await getSupabase().auth.getUser();
      if (!user) throw new Error('Utilisateur non authentifié');

      const { error } = await getSupabase()
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id);
      if (error) throw error;
      
      // Mettre à jour l'état local pour un retour visuel immédiat
      set(state => ({ user: state.user ? { ...state.user, ...updates } : null, loading: false }));
      return { error: null };
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return { error };
    }
  },
}));

// --- Initialiseur d'authentification ---
let authListener: any = null;

export const subscribeToAuthChanges = () => {
  if (authListener) {
    // Déjà abonné, retourner une fonction de nettoyage vide
    return () => {}; 
  }

  const { data: { subscription } } = getSupabase().auth.onAuthStateChange(
    (event, session) => {
      console.log(`Événement d'authentification: ${event}`);
      // Déclencher le chargement de l'utilisateur à chaque changement d'état d'authentification
      useAuth.getState().loadUser();
    }
  );
  authListener = subscription;

  // Chargement initial des données utilisateur
  useAuth.getState().loadUser();

  // Retourner la fonction de désabonnement
  return () => {
    authListener?.unsubscribe();
    authListener = null;
  };
};