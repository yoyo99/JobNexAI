"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionStatus = SubscriptionStatus;
const jsx_runtime_1 = require("react/jsx-runtime");
const auth_1 = require("../stores/auth");
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
const react_router_dom_1 = require("react-router-dom");
function SubscriptionStatus() {
    const { user, subscription } = (0, auth_1.useAuth)();
    const getStatusLabel = () => {
        if (!subscription)
            return 'Aucun abonnement';
        switch (subscription.status) {
            case 'trialing':
                return 'Période d\'essai';
            case 'active':
                return 'Actif';
            case 'canceled':
                return 'Annulé';
            case 'incomplete':
                return 'Incomplet';
            case 'incomplete_expired':
                return 'Expiré';
            case 'past_due':
                return 'Paiement en retard';
            case 'unpaid':
                return 'Impayé';
            default:
                return 'Inconnu';
        }
    };
    const getStatusColor = () => {
        if (!subscription)
            return 'bg-gray-600 text-gray-100';
        switch (subscription.status) {
            case 'trialing':
                return 'bg-blue-600/20 text-blue-400';
            case 'active':
                return 'bg-green-600/20 text-green-400';
            case 'canceled':
                return 'bg-red-600/20 text-red-400';
            case 'incomplete':
            case 'incomplete_expired':
            case 'past_due':
            case 'unpaid':
                return 'bg-yellow-600/20 text-yellow-400';
            default:
                return 'bg-gray-600/20 text-gray-400';
        }
    };
    const isTrialActive = (user === null || user === void 0 ? void 0 : user.trial_ends_at) && new Date(user.trial_ends_at) > new Date();
    return ((0, jsx_runtime_1.jsx)("div", { className: "bg-white/5 rounded-lg p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`, children: getStatusLabel() }), (0, jsx_runtime_1.jsx)("span", { className: "text-white font-medium capitalize", children: (subscription === null || subscription === void 0 ? void 0 : subscription.plan) || 'Free' })] }), isTrialActive && ((0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-400 mt-1", children: ["P\u00E9riode d'essai jusqu'au ", (0, date_fns_1.format)(new Date(user.trial_ends_at), 'dd MMMM yyyy', { locale: locale_1.fr })] })), (subscription === null || subscription === void 0 ? void 0 : subscription.current_period_end) && ((0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-400 mt-1", children: ["Prochaine facturation le ", (0, date_fns_1.format)(new Date(subscription.current_period_end), 'dd MMMM yyyy', { locale: locale_1.fr })] }))] }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/billing", className: "text-primary-400 hover:text-primary-300 text-sm", children: "G\u00E9rer" })] }) }));
}
