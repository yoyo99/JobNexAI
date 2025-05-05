"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
exports.createCheckoutSession = createCheckoutSession;
const stripe_js_1 = require("@stripe/stripe-js");
const supabase_1 = require("./supabase");
// Initialize stripe in an async function instead of using top-level await
let stripe = null;
exports.stripe = stripe;
// Initialize stripe in an async function
const initStripe = () => __awaiter(void 0, void 0, void 0, function* () {
    exports.stripe = stripe = yield (0, stripe_js_1.loadStripe)(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
});
// Initialize stripe immediately
initStripe();
function createCheckoutSession(userId, priceId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabase_1.supabase.functions.invoke('create-checkout-session', {
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
export {};
