import { useEffect, useState } from 'react'
import { useAuth } from '../stores/auth'
import { supabase } from '../lib/supabase'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { loadUser } = useAuth()
  const [initialized, setInitialized] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    console.log('AuthProvider: Initializing...')
    let subscription: { unsubscribe: () => void } | null = null

    const initAuth = async () => {
      try {
        // Charger l'utilisateur au démarrage
        await loadUser()
        
        // Configurer les écouteurs d'événements d'authentification seulement si supabase est disponible
        if (supabase && supabase.auth) {
          try {
            const authChangeResult = supabase.auth.onAuthStateChange(
              async (event, _session) => {
                try {
                  if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    await loadUser()
                  } else if (event === 'SIGNED_OUT') {
                    // L'utilisateur est déjà déconnecté dans le store via signOut()
                  }
                } catch (innerError) {
                  console.error('AuthProvider: Error handling auth event', innerError)
                }
              }
            )

            // Extraction sécurisée de l'abonnement
            subscription = authChangeResult?.data?.subscription || { unsubscribe: () => {} }
          } catch (authError) {
            console.error('AuthProvider: Failed to set up auth listener', authError)
            // Continue without auth listener, app will still function with limited capabilities
          }
        } else {
          console.warn('AuthProvider: Supabase auth not available, functioning in limited mode')
        }
        
        setInitialized(true)
      } catch (err) {
        console.error('AuthProvider: Critical initialization error', err)
        setError(err instanceof Error ? err : new Error(String(err)))
        // Let the app continue even with auth error
        setInitialized(true)
      }
    }

    initAuth()

    // Écouteur d'événement storage pour synchroniser la session sur tous les onglets
    const handleStorage = () => {
      try {
        loadUser()
      } catch (storageError) {
        console.error('AuthProvider: Error handling storage event', storageError)
      }
    };
    
    try {
      window.addEventListener('storage', handleStorage);
    } catch (eventError) {
      console.error('AuthProvider: Failed to add storage listener', eventError)
    }

    // Nettoyer l'abonnement et l'écouteur
    return () => {
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (unsubError) {
          console.error('AuthProvider: Error during unsubscribe', unsubError)
        }
      }
      
      try {
        window.removeEventListener('storage', handleStorage);
      } catch (removeError) {
        console.error('AuthProvider: Error removing event listener', removeError)
      }
    }
  }, [loadUser])

  // Rendre simplement les enfants, même en cas d'erreur pour ne pas bloquer l'application
  if (error) {
    console.warn('AuthProvider is continuing despite initialization error:', error)
  }
  
  return <>{children}</>
}