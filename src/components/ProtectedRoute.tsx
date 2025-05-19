import * as React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../stores/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiresSubscription?: boolean
}

export function ProtectedRoute({ children, requiresSubscription = false }: ProtectedRouteProps) {
  const { user, subscription, loading, initialized } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Agir seulement quand le chargement initial est terminé et qu'on n'est plus en train de charger activement
    if (!loading && initialized) {
      if (!user) {
        console.log('[ProtectedRoute] User not found after init, redirecting to /login');
        navigate('/login', { state: { from: location }, replace: true });
        return; // Sortir tôt pour éviter la logique d'abonnement si pas d'utilisateur
      }

      if (requiresSubscription) {
        const isTrialValid = user.trial_ends_at && new Date(user.trial_ends_at) > new Date();
        const hasActiveSubscription = subscription?.status === 'active' || subscription?.status === 'trialing';
        if (!isTrialValid && !hasActiveSubscription) {
          console.log('[ProtectedRoute] Subscription required/invalid after init, redirecting to /pricing');
          navigate('/pricing', { state: { from: location }, replace: true });
        }
      }
    }
  }, [user, loading, initialized, subscription, requiresSubscription, navigate, location]);

  // 1. Gérer l'état de chargement initial ou le chargement en cours
  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400"></div>
      </div>
    );
  }

  // 2. Si le chargement est terminé et que l'application est initialisée:
  //    Vérifier si l'utilisateur existe et remplit les conditions d'abonnement.
  //    Si une redirection est nécessaire (gérée par useEffect), rendre null pour éviter d'afficher les enfants prématurément.
  if (!user) {
    // L'utilisateur n'est pas là, useEffect devrait avoir déclenché une redirection.
    // Rendre null pour attendre que la redirection prenne effet.
    return null;
  }

  if (requiresSubscription) {
    const isTrialValid = user.trial_ends_at && new Date(user.trial_ends_at) > new Date();
    const hasActiveSubscription = subscription?.status === 'active' || subscription?.status === 'trialing';
    if (!isTrialValid && !hasActiveSubscription) {
      // L'abonnement est requis mais manquant/invalide, useEffect devrait avoir déclenché une redirection.
      // Rendre null pour attendre que la redirection prenne effet.
      return null;
    }
  }

  // 3. Si tous les contrôles sont passés (chargement terminé, utilisateur existe, abonnement OK),
  //    rendre les enfants du composant.
  return <>{children}</>;
}