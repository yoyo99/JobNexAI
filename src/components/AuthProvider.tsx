import { useEffect } from 'react';
import { useAuth, subscribeToAuthChanges } from '../stores/auth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { initialized, loading } = useAuth();

  useEffect(() => {
    // S'abonne aux changements d'état d'authentification au montage du composant.
    // La fonction retournée par `subscribeToAuthChanges` est la fonction de nettoyage
    // qui sera automatiquement appelée par React lors du démontage du composant.
    const unsubscribe = subscribeToAuthChanges();

    // Écouteur pour la synchronisation entre onglets
    const handleStorage = () => {
      console.log('Événement de stockage détecté, rechargement des données utilisateur.');
      useAuth.getState().loadUser();
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      // Nettoyage de l'abonnement et de l'écouteur d'événement
      unsubscribe();
      window.removeEventListener('storage', handleStorage);
    };
  }, []); // Le tableau de dépendances vide garantit que cela ne s'exécute qu'une seule fois.

  // Pendant que l'état d'authentification est en cours d'initialisation, afficher un écran de chargement.
  // `initialized` devient `true` dès que la première vérification de session est terminée (avec ou sans utilisateur).
  if (!initialized) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#111827', color: 'white' }}>
        <p>Chargement de l'application...</p>
        {/* Optionnel: Ajouter un spinner SVG ou une animation ici */}
      </div>
    );
  }

  // Une fois l'initialisation terminée, rendre les composants enfants.
  // La logique de redirection (par exemple, vers /login) sera gérée par les `ProtectedRoute`.
  return <>{children}</>;
}