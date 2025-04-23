import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../stores/auth';
export function ProtectedRoute({ children, requiresSubscription = false }) {
    const { user, subscription, loading, initialized } = useAuth();
    const location = useLocation();
    // Afficher un loader pendant la vérification de l'authentification
    if (!initialized || loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    if (!user) {
        return _jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
    }
    // Vérifier si l'utilisateur a un abonnement actif ou une période d'essai valide
    if (requiresSubscription) {
        const isTrialValid = user.trial_ends_at && new Date(user.trial_ends_at) > new Date();
        const hasActiveSubscription = (subscription === null || subscription === void 0 ? void 0 : subscription.status) === 'active' || (subscription === null || subscription === void 0 ? void 0 : subscription.status) === 'trialing';
        if (!isTrialValid && !hasActiveSubscription) {
            return _jsx(Navigate, { to: "/pricing", state: { from: location }, replace: true });
        }
    }
    return _jsx(_Fragment, { children: children });
}
