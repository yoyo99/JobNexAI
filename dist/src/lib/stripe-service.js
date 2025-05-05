var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';
import { trackError, trackEvent } from './monitoring';
// Initialiser Stripe
let stripePromise = null;
const getStripe = () => {
    if (!stripePromise) {
        stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLIC_KEY);
    }
    return stripePromise;
};
export const StripeService = {
    /**
     * Crée une session de paiement Stripe Checkout
     */
    createCheckoutSession(userId, priceId, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Appeler la fonction Edge pour créer une session Checkout
                const { data, error } = yield supabase.functions.invoke('create-checkout-session', {
                    body: {
                        priceId,
                        userId,
                        userType
                    }
                });
                if (error)
                    throw error;
                const { sessionId } = data;
                // Rediriger vers Stripe Checkout
                const stripe = yield getStripe();
                const { error: stripeError } = yield stripe.redirectToCheckout({ sessionId });
                if (stripeError)
                    throw stripeError;
                trackEvent('subscription.checkout.started', {
                    userId,
                    priceId,
                    userType
                });
                return { success: true, error: null };
            }
            catch (error) {
                trackError(error, { context: 'stripe.checkout' });
                return {
                    success: false,
                    error: error.message || 'Une erreur est survenue lors de la création de la session de paiement'
                };
            }
        });
    },
    /**
     * Crée une session de portail client Stripe
     */
    createPortalSession(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Appeler la fonction Edge pour créer une session de portail
                const { data, error } = yield supabase.functions.invoke('create-portal-session', {
                    body: { customerId }
                });
                if (error)
                    throw error;
                // Rediriger vers le portail client
                window.location.href = data.url;
                trackEvent('subscription.portal.opened', {
                    customerId
                });
                return { success: true, error: null };
            }
            catch (error) {
                trackError(error, { context: 'stripe.portal' });
                return {
                    success: false,
                    error: error.message || 'Une erreur est survenue lors de la création de la session de portail'
                };
            }
        });
    },
    /**
     * Vérifie le statut d'une session de paiement
     */
    checkSessionStatus(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, error } = yield supabase.functions.invoke('check-session-status', {
                    body: { sessionId }
                });
                if (error)
                    throw error;
                trackEvent('subscription.checkout.completed', {
                    sessionId,
                    status: data.status
                });
                return { success: true, data, error: null };
            }
            catch (error) {
                trackError(error, { context: 'stripe.check_session' });
                return {
                    success: false,
                    data: null,
                    error: error.message || 'Une erreur est survenue lors de la vérification de la session'
                };
            }
        });
    }
};
