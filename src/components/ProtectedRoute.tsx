import * as React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../stores/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiresSubscription?: boolean
}

export function ProtectedRoute({ children, requiresSubscription = false }: ProtectedRouteProps) {
  const { user, subscription, loading, initialized } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Afficher un loader pendant la vérification de l'authentification
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400"></div>
      </div>
    )
  }

  // Gérer la redirection si l'utilisateur n'est pas connecté
  // ou si l'abonnement est requis mais manquant
  React.useEffect(() => {
    if (!loading && initialized) { // Agir seulement quand le chargement initial est terminé
      if (!user) {
        console.log('[ProtectedRoute] User not found, redirecting to /login');
        navigate('/login', { state: { from: location }, replace: true });
        return; // Important pour éviter la vérification d'abonnement si pas d'utilisateur
      }

      if (requiresSubscription) {
        const isTrialValid = user.trial_ends_at && new Date(user.trial_ends_at) > new Date();
        const hasActiveSubscription = subscription?.status === 'active' || subscription?.status === 'trialing';
        if (!isTrialValid && !hasActiveSubscription) {
          console.log('[ProtectedRoute] Subscription required and missing/invalid, redirecting to /pricing');
          navigate('/pricing', { state: { from: location }, replace: true });
        }
      }
    }
  }, [user, loading, initialized, subscription, requiresSubscription, navigate, location]);

  // Si l'utilisateur est connecté et a l'abonnement requis (ou pas d'abo requis),
  // OU si l'état de chargement/initialisation n'est pas encore prêt pour une redirection,
  // on rend les enfants (ou le loader si c'est le cas).
  // Le useEffect ci-dessus gérera les redirections.

  // Ne pas rendre les enfants si une redirection est imminente à cause de !user ou !subscription
  if (!loading && initialized) {
    if (!user) return null; // Redirection gérée par useEffect
    if (requiresSubscription) {
      const isTrialValid = user.trial_ends_at && new Date(user.trial_ends_at) > new Date();
      const hasActiveSubscription = subscription?.status === 'active' || subscription?.status === 'trialing';
      if (!isTrialValid && !hasActiveSubscription) return null; // Redirection gérée par useEffect
    }
  }

  return <>{children}</>
}