var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../stores/auth';
import { StripeService } from '../lib/stripe-service';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PaymentMethodList } from './PaymentMethodList';
export function SubscriptionManager() {
    const { user, subscription, loadUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    // Vérifier si l'URL contient un paramètre de session Stripe
    useEffect(() => {
        const checkStripeSession = () => __awaiter(this, void 0, void 0, function* () {
            const urlParams = new URLSearchParams(window.location.search);
            const sessionId = urlParams.get('session_id');
            if (sessionId) {
                try {
                    setLoading(true);
                    const { success, data, error } = yield StripeService.checkSessionStatus(sessionId);
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
            const { success, error } = yield StripeService.createPortalSession(subscription.stripe_customer_id);
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
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h2", { className: "text-lg font-medium text-white", children: "Gestion de l'abonnement" }), error && (_jsx("div", { className: "bg-red-900/50 text-red-400 p-4 rounded-lg", children: error })), success && (_jsx("div", { className: "bg-green-900/50 text-green-400 p-4 rounded-lg", children: success })), _jsx("div", { className: "bg-white/5 rounded-lg p-6", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-400", children: "Statut" }), _jsx("p", { className: "text-white font-medium", children: getSubscriptionStatus() })] }), subscription && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-400", children: "Plan" }), _jsx("p", { className: "text-white font-medium capitalize", children: subscription.plan })] }), subscription.current_period_end && (_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-400", children: "Prochaine facturation" }), _jsx("p", { className: "text-white font-medium", children: format(new Date(subscription.current_period_end), 'dd MMMM yyyy', { locale: fr }) })] })), subscription.cancel_at && (_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-400", children: "Annulation pr\u00E9vue le" }), _jsx("p", { className: "text-white font-medium", children: format(new Date(subscription.cancel_at), 'dd MMMM yyyy', { locale: fr }) })] }))] })), (user === null || user === void 0 ? void 0 : user.trial_ends_at) && new Date(user.trial_ends_at) > new Date() && (_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-400", children: "Fin de la p\u00E9riode d'essai" }), _jsx("p", { className: "text-white font-medium", children: format(new Date(user.trial_ends_at), 'dd MMMM yyyy à HH:mm', { locale: fr }) })] })), _jsx("div", { className: "pt-4", children: (subscription === null || subscription === void 0 ? void 0 : subscription.stripe_customer_id) ? (_jsx("button", { onClick: handleManageSubscription, disabled: loading, className: "btn-primary w-full", children: loading ? 'Chargement...' : 'Gérer mon abonnement' })) : (_jsx("a", { href: "/pricing", className: "btn-primary block text-center w-full", children: "Voir les plans" })) })] }) }), _jsx(PaymentMethodList, {})] }));
}
