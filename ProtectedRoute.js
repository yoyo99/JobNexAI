"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtectedRoute = ProtectedRoute;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const auth_1 = require("../stores/auth");
function ProtectedRoute({ children, requiresSubscription = false }) {
    const { user, subscription, loading, initialized } = (0, auth_1.useAuth)();
    const location = (0, react_router_dom_1.useLocation)();
    // Afficher un loader pendant la vérification de l'authentification
    if (!initialized || loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    if (!user) {
        return (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/login", state: { from: location }, replace: true });
    }
    // Vérifier si l'utilisateur a un abonnement actif ou une période d'essai valide
    if (requiresSubscription) {
        const isTrialValid = user.trial_ends_at && new Date(user.trial_ends_at) > new Date();
        const hasActiveSubscription = (subscription === null || subscription === void 0 ? void 0 : subscription.status) === 'active' || (subscription === null || subscription === void 0 ? void 0 : subscription.status) === 'trialing';
        if (!isTrialValid && !hasActiveSubscription) {
            return (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/pricing", state: { from: location }, replace: true });
        }
    }
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
}
