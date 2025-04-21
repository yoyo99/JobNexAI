"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionManager = SubscriptionManager;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const auth_1 = require("../stores/auth");
const stripe_service_1 = require("../lib/stripe-service");
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
const PaymentMethodList_1 = require("./PaymentMethodList");
function SubscriptionManager() {
    const { user, subscription, loadUser } = (0, auth_1.useAuth)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [success, setSuccess] = (0, react_1.useState)(null);
    // Vérifier si l'URL contient un paramètre de session Stripe
    (0, react_1.useEffect)(() => {
        const checkStripeSession = () => __awaiter(this, void 0, void 0, function* () {
            const urlParams = new URLSearchParams(window.location.search);
            const sessionId = urlParams.get('session_id');
            if (sessionId) {
                try {
                    setLoading(true);
                    const { success, data, error } = yield stripe_service_1.StripeService.checkSessionStatus(sessionId);
                    if (!success || error) {
                        throw new Error(error || 'Une erreur est survenue lors de la vérification de la session');
                    }
                    // Recharger les informations utilisateur
                    yield loadUser();
                    setSuccess('Votre abonnement a été activé avec succès !');
                    // Nettoyer l'URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
                catch (error) {
                    setError(error.message || 'Une erreur est survenue');
                }
                finally {
                    setLoading(false);
                }
            }
        });
        checkStripeSession();
    }, []);
    const handleManageSubscription = () => __awaiter(this, void 0, void 0, function* () {
        if (!user || !(subscription === null || subscription === void 0 ? void 0 : subscription.stripe_customer_id))
            return;
        try {
            setLoading(true);
            setError(null);
            const { success, error } = yield stripe_service_1.StripeService.createPortalSession(subscription.stripe_customer_id);
            if (!success) {
                throw new Error(error || 'Une erreur est survenue lors de la création de la session');
            }
        }
        catch (error) {
            setError(error.message || 'Une erreur est survenue');
        }
        finally {
            setLoading(false);
        }
    });
    const getSubscriptionStatus = () => {
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
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-medium text-white", children: "Gestion de l'abonnement" }), error && ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-900/50 text-red-400 p-4 rounded-lg", children: error })), success && ((0, jsx_runtime_1.jsx)("div", { className: "bg-green-900/50 text-green-400 p-4 rounded-lg", children: success })), (0, jsx_runtime_1.jsx)("div", { className: "bg-white/5 rounded-lg p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: "Statut" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white font-medium", children: getSubscriptionStatus() })] }), subscription && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: "Plan" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white font-medium capitalize", children: subscription.plan })] }), subscription.current_period_end && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: "Prochaine facturation" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white font-medium", children: (0, date_fns_1.format)(new Date(subscription.current_period_end), 'dd MMMM yyyy', { locale: locale_1.fr }) })] })), subscription.cancel_at && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: "Annulation pr\u00E9vue le" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white font-medium", children: (0, date_fns_1.format)(new Date(subscription.cancel_at), 'dd MMMM yyyy', { locale: locale_1.fr }) })] }))] })), (user === null || user === void 0 ? void 0 : user.trial_ends_at) && new Date(user.trial_ends_at) > new Date() && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: "Fin de la p\u00E9riode d'essai" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white font-medium", children: (0, date_fns_1.format)(new Date(user.trial_ends_at), 'dd MMMM yyyy à HH:mm', { locale: locale_1.fr }) })] })), (0, jsx_runtime_1.jsx)("div", { className: "pt-4", children: (subscription === null || subscription === void 0 ? void 0 : subscription.stripe_customer_id) ? ((0, jsx_runtime_1.jsx)("button", { onClick: handleManageSubscription, disabled: loading, className: "btn-primary w-full", children: loading ? 'Chargement...' : 'Gérer mon abonnement' })) : ((0, jsx_runtime_1.jsx)("a", { href: "/pricing", className: "btn-primary block text-center w-full", children: "Voir les plans" })) })] }) }), (0, jsx_runtime_1.jsx)(PaymentMethodList_1.PaymentMethodList, {})] }));
}
