import { useEffect } from 'react'
import { useAuth } from '../stores/auth'
import { supabase } from '../lib/supabase'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { loadUser } = useAuth()

  useEffect(() => {
    // Charger l'utilisateur au démarrage
    loadUser()

    // Configurer les écouteurs d'événements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, _session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await loadUser()
        } else if (event === 'SIGNED_OUT') {
          // L'utilisateur est déjà déconnecté dans le store via signOut()
        }
      }
    )

    // Écouteur d'événement storage pour synchroniser la session sur tous les onglets
    const handleStorage = () => {
      loadUser();
    };
    window.addEventListener('storage', handleStorage);

    // Nettoyer l'abonnement et l'écouteur
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorage);
    }
  }, [loadUser])

  return <>{children}</>
}