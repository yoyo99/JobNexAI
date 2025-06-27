import { useEffect, useState } from 'react'
import { useAuth } from '../stores/auth'
import { getSupabase } from '../hooks/useSupabaseConfig'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { loadUser, initialized, loading: authStoreLoading } = useAuth();
  const [error, setError] = useState<Error | null>(null);
  const [hasBeenInitializedOnce, setHasBeenInitializedOnce] = useState(false); // NOUVEL ÉTAT

  useEffect(() => {
    console.log('AuthProvider: Initializing...')
    let subscription: { unsubscribe: () => void } | null = null

    const initAuth = async () => {
      try {
        // Charger l'utilisateur au démarrage
        await loadUser()
        
        // Configurer les écouteurs d'événements d'authentification en utilisant getSupabase()
        const supabaseClient = getSupabase();
        if (supabaseClient && supabaseClient.auth) {
          try {
            const authChangeResult = supabaseClient.auth.onAuthStateChange(
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
        
        // setInitialized(true); // Géré par le store auth maintenant
      } catch (err) {
        console.error('AuthProvider: Critical initialization error', err)
        setError(err instanceof Error ? err : new Error(String(err)));
        // Let the app continue even with auth error
        // setInitialized(true); // Géré par le store auth maintenant
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

  // NOUVEAU useEffect pour suivre la première initialisation
  useEffect(() => {
    if (initialized) {
      setHasBeenInitializedOnce(true);
    }
  }, [initialized]);

  // Rendre simplement les enfants, même en cas d'erreur pour ne pas bloquer l'application
  if (error) {
    console.warn('AuthProvider is continuing despite initialization error:', error);
    // Envisagez d'afficher une page d'erreur dédiée ici
  }

  // Attendre que le store auth soit initialisé
  console.log(`[AuthProvider] Rendering. initialized: ${initialized}, authStoreLoading: ${authStoreLoading}, hasBeenInitializedOnce: ${hasBeenInitializedOnce}`);
  
  // Vérifions si nous sommes en train de nous déconnecter pour ne pas afficher le chargement indéfiniment
  // Si nous avons été initialisés ET authStoreLoading est false, cela veut dire qu'il n'y a pas d'opération en cours
  // Dans ce cas, on affiche toujours les enfants même si initialized est devenu false suite à une déconnexion
  if (hasBeenInitializedOnce && !authStoreLoading) {
    return <>{children}</>;
  }
  
  // Si nous n'avons jamais été initialisés ou si nous sommes en cours de chargement
  if (!hasBeenInitializedOnce || authStoreLoading) { 
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#1a202c', color: 'white' }}>Chargement de l'application...</div>;
  }
  
  return <>{children}</>;
}