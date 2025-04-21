"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpgradePrompt = UpgradePrompt;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const react_router_dom_1 = require("react-router-dom");
const auth_1 = require("../stores/auth");
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
const outline_1 = require("@heroicons/react/24/outline");
function UpgradePrompt() {
    const { user, subscription } = (0, auth_1.useAuth)();
    // Si l'utilisateur a un abonnement actif, ne pas afficher la bannière
    if ((subscription === null || subscription === void 0 ? void 0 : subscription.status) === 'active') {
        return null;
    }
    // Si l'utilisateur est en période d'essai, afficher le temps restant
    const isTrialActive = (user === null || user === void 0 ? void 0 : user.trial_ends_at) && new Date(user.trial_ends_at) > new Date();
    return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: "bg-gradient-to-r from-primary-600/20 to-secondary-600/20 rounded-lg p-6 mb-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 bg-primary-600/30 rounded-lg", children: (0, jsx_runtime_1.jsx)(outline_1.SparklesIcon, { className: "h-6 w-6 text-primary-400" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-white", children: isTrialActive
                                ? 'Votre période d\'essai est active'
                                : 'Débloquez toutes les fonctionnalités premium' }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 mt-1", children: isTrialActive
                                ? `Profitez de toutes les fonctionnalités premium jusqu'au ${(0, date_fns_1.format)(new Date(user.trial_ends_at), 'dd MMMM yyyy', { locale: locale_1.fr })}`
                                : 'Accédez à des fonctionnalités avancées pour optimiser votre recherche d\'emploi' }), (0, jsx_runtime_1.jsx)("div", { className: "mt-4", children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/pricing", className: "btn-primary inline-flex", children: isTrialActive ? 'Passer au plan Pro' : 'Voir les plans' }) })] })] }) }));
}
