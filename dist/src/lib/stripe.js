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
// Initialize stripe in an async function instead of using top-level await
let stripe = null;
// Initialize stripe in an async function
const initStripe = () => __awaiter(void 0, void 0, void 0, function* () {
    stripe = yield loadStripe(process.env.VITE_STRIPE_PUBLIC_KEY);
});
// Initialize stripe immediately
initStripe();
export function createCheckoutSession(userId, priceId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabase.functions.invoke('create-checkout-session', {
                body: { priceId, userId }
            });
            if (error)
                throw error;
            const { sessionId } = data;
            if (!stripe)
                throw new Error('Stripe not loaded');
            const { error: stripeError } = yield stripe.redirectToCheckout({ sessionId });
            if (stripeError)
                throw stripeError;
        }
        catch (error) {
            console.error('Error creating checkout session:', error);
            throw error;
        }
    });
}
export { stripe };
