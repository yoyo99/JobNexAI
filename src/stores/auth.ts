import { create } from 'zustand'
import { supabase, type Profile, type Subscription } from '../lib/supabase'
import { AuthService } from '../lib/auth-service'

interface AuthState {
  user: Profile | null
  subscription: Subscription | null
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
  loading: true,
  initialized: false,

  loadUser: async () => {
    try {
      set({ loading: true })
      
      // Vérifier si l'utilisateur est connecté
      const { user: authUser } = await AuthService.getCurrentUser()
      console.log('[AUTH][loadUser] authUser =', authUser);
      
      if (!authUser) {
        set({ user: null, subscription: null, loading: false, initialized: true })
        console.log('[AUTH][loadUser] Aucun utilisateur connecté');
        return
      }

      // Récupérer le profil complet et l'abonnement
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (profileError) throw profileError
      console.log('[AUTH][loadUser] Fetched profile =', profile); // AJOUTER CETTE LIGNE

      // Récupérer l'abonnement
      const { data: subscription, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', authUser.id)
        .single()

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        // PGRST116 = not found, ce qui est normal si l'utilisateur n'a pas d'abonnement
        throw subscriptionError
      }

      set({
        user: profile,
        subscription: subscription || null,
        loading: false,
        initialized: true
      })
      console.log('[AUTH][loadUser] User set in store =', get().user); // AJOUTER CETTE LIGNE
    } catch (error) {
      console.error('Error loading user:', error)
      set({ loading: false, initialized: true })
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
    set({ user: null, subscription: null })
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