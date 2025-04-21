"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionBanner = SubscriptionBanner;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const react_router_dom_1 = require("react-router-dom");
const auth_1 = require("../stores/auth");
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
const outline_1 = require("@heroicons/react/24/outline");
function SubscriptionBanner() {
    const { user, subscription } = (0, auth_1.useAuth)();
    // Si l'utilisateur a un abonnement actif, ne pas afficher la bannière
    if ((subscription === null || subscription === void 0 ? void 0 : subscription.status) === 'active') {
        return null;
    }
    // Si l'utilisateur est en période d'essai, afficher le temps restant
    const isTrialActive = (user === null || user === void 0 ? void 0 : user.trial_ends_at) && new Date(user.trial_ends_at) > new Date();
    if (!isTrialActive && (subscription === null || subscription === void 0 ? void 0 : subscription.status) !== 'trialing') {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: "fixed bottom-4 right-4 z-40 max-w-md bg-gradient-to-r from-primary-600/90 to-secondary-600/90 backdrop-blur-sm rounded-lg p-4 shadow-xl", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-white/10 rounded-lg", children: (0, jsx_runtime_1.jsx)(outline_1.SparklesIcon, { className: "h-6 w-6 text-white" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-white", children: isTrialActive
                                ? 'Votre période d\'essai est active'
                                : 'Votre période d\'essai est terminée' }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/80 mt-1", children: isTrialActive
                                ? `Profitez de toutes les fonctionnalités premium jusqu'au ${(0, date_fns_1.format)(new Date(user.trial_ends_at), 'dd MMMM yyyy', { locale: locale_1.fr })}`
                                : 'Passez à un plan payant pour continuer à profiter de toutes les fonctionnalités' }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/pricing", className: "bg-white text-primary-600 hover:bg-white/90 px-4 py-2 rounded-lg font-medium text-sm", children: isTrialActive ? 'Passer au plan Pro' : 'Voir les plans' }), (0, jsx_runtime_1.jsx)("button", { onClick: () => {
                                        // Masquer la bannière en utilisant localStorage
                                        localStorage.setItem('subscription_banner_dismissed', 'true');
                                        // Forcer un re-render
                                        window.location.reload();
                                    }, className: "text-white/80 hover:text-white text-sm", children: "Plus tard" })] })] })] }) }));
}
