import { create } from 'zustand'

let isLoadUserRunning = false; // Drapeau pour prévenir les exécutions concurrentes
import { supabase, type Profile, type Subscription } from '../lib/supabase';

import { AuthService } from '../lib/auth-service';
import type { UserPreferencesAuth } from '../types/user';

interface AuthState {
  user: Profile | null
  subscription: Subscription | null
  userPreferences: UserPreferencesAuth | null; // Ajout des préférences utilisateur
  loading: boolean
  initialized: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  loadUser: () => Promise<void>
  updateProfile: (profile: { full_name?: string }) => Promise<{ error: string | null }>
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  subscription: null,
  userPreferences: null, // Initialisation
  loading: true,
  initialized: false,

  loadUser: async () => {
    if (isLoadUserRunning) {
      const callIdWarning = Date.now();
      console.warn(`[AUTH][loadUser][${callIdWarning}] Aborted: execution already in progress.`);
      return;
    }
    isLoadUserRunning = true;
    const callId = Date.now(); // Simple ID pour tracer l'appel
    console.log(`[AUTH][loadUser][${callId}] Execution started.`);
    try {
      set(state => {
        console.log(`[AUTH][loadUser][${callId}] Setting loading: true. Current initialized: ${state.initialized}`);
        return { loading: true };
      });
      
      // Vérifier si l'utilisateur est connecté
      console.log(`[AUTH][loadUser][${callId}] Before await AuthService.getCurrentUser()`);
      const { user: authUser, error: currentUserError } = await AuthService.getCurrentUser();
      console.log(`[AUTH][loadUser][${callId}] After await AuthService.getCurrentUser(). authUser:`, authUser, "Error:", currentUserError);
      console.log('[AUTH][loadUser] authUser =', authUser);
      
      if (currentUserError || !authUser) {
        console.log(`[AUTH][loadUser][${callId}] currentUserError or no authUser. Error:`, currentUserError);
        set(state => {
          console.log(`[AUTH][loadUser][${callId}] No authUser. Setting loading: false, initialized: true. Current initialized: ${state.initialized}`);
          return { user: null, subscription: null, userPreferences: null, loading: false, initialized: true };
        });
        console.log('[AUTH][loadUser] Aucun utilisateur connecté ou erreur lors de la récupération.');
        return
      }

      // Si pas d'erreur et authUser existe:
      if (!authUser) { // Cette condition est maintenant redondante mais gardée pour la structure existante
        set(state => {
          console.log(`[AUTH][loadUser][${callId}] No authUser. Setting loading: false, initialized: true. Current initialized: ${state.initialized}`);
          return { user: null, subscription: null, userPreferences: null, loading: false, initialized: true };
        });
        console.log('[AUTH][loadUser] Aucun utilisateur connecté');
        return
      }
      // Récupérer le profil complet et l'abonnement
      console.log(`[AUTH][loadUser][${callId}] Before await supabase.from('profiles')... for user ID: ${authUser.id}`);
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      console.log(`[AUTH][loadUser][${callId}] After await supabase.from('profiles')... profileError:`, profileError);
      if (profileError) {
        console.error(`[AUTH][loadUser][${callId}] Error fetching profile. Code: ${profileError.code}, Message: ${profileError.message}, Details: ${profileError.details}, Hint: ${profileError.hint}, FullError:`, JSON.stringify(profileError));
        throw profileError; // Re-throw the original error object
      }
      console.log(`[AUTH][loadUser][${callId}] Fetched profile =`, profile);

      // Récupérer l'abonnement
      console.log(`[AUTH][loadUser][${callId}] Before await supabase.from('subscriptions')... for user ID: ${authUser.id}`);
      const { data: subscription, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', authUser.id)
        .single()

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        // PGRST116 = not found, ce qui est normal si l'utilisateur n'a pas d'abonnement
        throw subscriptionError;
      }
      console.log(`[AUTH][loadUser][${callId}] After await supabase.from('subscriptions')... subscriptionError:`, subscriptionError);

      // Récupérer les préférences utilisateur
      console.log(`[AUTH][loadUser][${callId}] Before await supabase.from('user_preferences')... for user ID: ${authUser.id}`);
      const { data: userPreferences, error: preferencesError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      if (preferencesError && preferencesError.code !== 'PGRST116') {
        // PGRST116 = not found, ce qui est normal si l'utilisateur n'a pas encore de préférences
        console.error(`[AUTH][loadUser][${callId}] Error fetching user_preferences:`, preferencesError);
        // On pourrait choisir de throw ici ou de continuer en mettant userPreferences à null
      }
      console.log(`[AUTH][loadUser][${callId}] Fetched userPreferences =`, userPreferences);

      set(state => {
        console.log(`[AUTH][loadUser][${callId}] Fetches successful. Setting final state. Current initialized: ${state.initialized}`);
        return {
          user: profile,
          subscription: subscription || null,
          userPreferences: userPreferences || null,
          loading: false,
          initialized: true
        };
      });
      console.log('[AUTH][loadUser] User set in store =', get().user); // AJOUTER CETTE LIGNE
    } catch (error) {
      const typedError = error as { message?: string; code?: string; details?: string; hint?: string; [key: string]: any };
      console.error(`[AUTH][loadUser][${callId}] Error caught in loadUser try block. Message: "${typedError?.message}", Code: "${typedError?.code}", Details: "${typedError?.details}", Hint: "${typedError?.hint}". Full error object:`, error);
      set(state => {
        console.log(`[AUTH][loadUser][${callId}] Error caught. Setting loading: false, initialized: true. Current initialized: ${state.initialized}`);
        return { user: null, subscription: null, userPreferences: null, loading: false, initialized: true }; // Réinitialiser user/sub/prefs en cas d'erreur
      });
      console.log(`[AUTH][loadUser][${callId}] Catch block finished.`);
    } finally {
      isLoadUserRunning = false;
      console.log(`[AUTH][loadUser][${callId}] Execution fully finished (finally block).`);
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const { user, error } = await AuthService.signIn(email, password)
      
      if (error) return { error: error.message }
      if (!user) return { error: 'Une erreur est survenue lors de la connexion' }
      
      await get().loadUser()
      return { error: null }
    } catch (error: any) {
      console.error('Error signing in:', error)
      return { error: error.message || 'Une erreur est survenue lors de la connexion' }
    }
  },

  signUp: async (email: string, password: string, fullName: string) => {
    try {
      const { user, error } = await AuthService.signUp(email, password, fullName)
      
      if (error) return { error: error.message }
      if (!user) return { error: 'Une erreur est survenue lors de l\'inscription' }
      
      return { error: null }
    } catch (error: any) {
      console.error('Error signing up:', error)
      return { error: error.message || 'Une erreur est survenue lors de l\'inscription' }
    }
  },

  signOut: async () => {
    const { error } = await AuthService.signOut()
    if (error) {
      console.error('Error signing out:', error)
    }
    set({ user: null, subscription: null, userPreferences: null })
  },

  updateProfile: async (profile: { full_name?: string }) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', get().user?.id)

      if (error) throw error
      
      // Recharger les informations de l'utilisateur
      await get().loadUser()
      
      return { error: null }
    } catch (error: any) {
      console.error('Error updating profile:', error)
      return { error: error.message || 'Une erreur est survenue lors de la mise à jour du profil' }
    }
  }
}))