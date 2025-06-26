import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

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

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({
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
      const { data, error: signUpError } = await supabase.auth.signUp({
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
        const { error: profileError } = await supabase
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
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, subscription: null });
      return { error: null };
    } catch (error: any) {
      console.error('Sign out error:', error);
      set({ error: error.message });
      return { error };
    } finally {
      set({ loading: false });
    }
  },

  loadUser: async () => {
    try {
      set({ loading: true, error: null });
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        set({ user: null, subscription: null });
        return;
      }
      
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) throw profileError;
      
      // Get subscription if exists
      let subscription = null;
      if (profile) {
        const { data: subData, error: subError } = await supabase
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');
      
      // Update auth user if email is being updated
      if (updates.email) {
        const { error: updateError } = await supabase.auth.updateUser({
          email: updates.email,
        });
        
        if (updateError) throw updateError;
      }
      
      // Update profile in public.profiles
      const { error: profileError } = await supabase
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
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
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