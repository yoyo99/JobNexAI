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
  initialized: boolean; // Ajout pour AuthProvider
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
  initialized: false, // Initialisation pour AuthProvider

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await getSupabase().auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Load user profile after successful sign in
      await get().loadUser();
      
      return { error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      set({ error: error.message });
      return { error };
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email: string, password: string, fullName: string) => {
    try {
      set({ loading: true, error: null });
      
      // Create auth user
      const { data, error: signUpError } = await getSupabase().auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Create profile in public.profiles table
      if (data.user) {
        const { error: profileError } = await getSupabase()
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: email,
            full_name: fullName,
            user_type: 'candidate', // Default user type
            updated_at: new Date().toISOString(),
          });

        if (profileError) throw profileError;
      }

      // Load user profile after successful sign up
      await get().loadUser();
      
      return { error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      set({ error: error.message });
      return { error };
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      console.log('[Auth] Début de la déconnexion');
      set({ loading: true, error: null });
      
      // Créons une promesse que l'on résoudra manuellement après avoir établi un timeout
      const promise = new Promise<{ error: any }>((resolve) => {
        // Déconnectons d'abord l'utilisateur via Supabase
        getSupabase().auth.signOut().then(({ error }) => {
          if (error) {
            console.error('[Auth] Erreur Supabase lors de la déconnexion:', error);
            set({ error: error.message, loading: false });
            resolve({ error });
            return;
          }

          console.log('[Auth] Déconnexion Supabase réussie, nettoyage de létat...');
          
          // Nettoyer l'état complètement
          set({ 
            user: null,
            subscription: null, 
            loading: false,
            error: null,
            initialized: true // Garder initialized à true est crucial
          });
          
          // Force le rechargement complet de la page après un court délai
          console.log('[Auth] Configuration du rechargement après délai...');
          setTimeout(() => {
            console.log('[Auth] Rechargement de la page.');
            window.location.href = '/login';
            resolve({ error: null });
          }, 100); // Délai court avant le rechargement
        });
      });
      
      return promise;
    } catch (error: any) {
      console.error('[Auth] Erreur inattendue lors de la déconnexion:', error);
      set({ error: error.message, loading: false });
      return { error };
    }
  },

  loadUser: async () => {
    try {
      set({ loading: true, error: null });
      
      // Get current session
      const { data: { session } } = await getSupabase().auth.getSession();
      
      if (!session?.user) {
        set({ user: null, subscription: null });
        return;
      }
      
      // Get user profile
      const { data: profile, error: profileError } = await getSupabase()
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) throw profileError;
      
      // Get subscription if exists
      let subscription = null;
      if (profile) {
        const { data: subData, error: subError } = await getSupabase()
          .from('subscriptions')
          .select('*')
          .eq('user_id', profile.id)
          .single();
          
        if (!subError && subData) {
          subscription = subData;
        }
      }
      
      set({ 
        user: profile || { 
          id: session.user.id, 
          email: session.user.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        subscription,
        initialized: true, // Définir initialized à true après le chargement
      });
      
    } catch (error: any) {
      console.error('Error loading user:', error);
      set({ error: error.message, user: null, subscription: null });
    } finally {
      set({ loading: false });
    }
  },

  resetPassword: async (email: string) => {
    try {
      set({ loading: true, error: null });
      const { error } = await getSupabase().auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Password reset error:', error);
      set({ error: error.message });
      return { error };
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (updates: Partial<Profile>) => {
    try {
      set({ loading: true, error: null });
      const { data: { user } } = await getSupabase().auth.getUser();
      
      if (!user) throw new Error('User not authenticated');
      
      // Update auth user if email is being updated
      if (updates.email) {
        const { error: updateError } = await getSupabase().auth.updateUser({
          email: updates.email,
        });
        
        if (updateError) throw updateError;
      }
      
      // Update profile in public.profiles
      const { error: profileError } = await getSupabase()
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
        
      if (profileError) throw profileError;
      
      // Reload user data
      await get().loadUser();
      
      return { error: null };
    } catch (error: any) {
      console.error('Update profile error:', error);
      set({ error: error.message });
      return { error };
    } finally {
      set({ loading: false });
    }
  },
}));

// Initialize auth state when the app loads
const initializeAuth = async () => {
  const { loadUser } = useAuth.getState();
  
  // Set up auth state change listener
  const { data: { subscription } } = getSupabase().auth.onAuthStateChange(
    async (event, session) => {
      console.log('Auth state changed:', event);
      await loadUser();
    }
  );
  
  // Initial load
  await loadUser();
  
  // Return cleanup function
  return () => {
    subscription?.unsubscribe();
  };
};

// Start auth initialization
initializeAuth().catch(console.error);