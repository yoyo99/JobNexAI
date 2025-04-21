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
exports.CheckoutForm = CheckoutForm;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const stripe_js_1 = require("@stripe/stripe-js");
const react_stripe_js_1 = require("@stripe/react-stripe-js");
const supabase_1 = require("../lib/supabase");
const auth_1 = require("../stores/auth");
const stripePromise = (0, stripe_js_1.loadStripe)(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
function CheckoutFormInner({ priceId, planName, onSuccess, onCancel }) {
    const { user, loadUser } = (0, auth_1.useAuth)();
    const stripe = (0, react_stripe_js_1.useStripe)();
    const elements = (0, react_stripe_js_1.useElements)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        if (!stripe || !elements || !user) {
            return;
        }
        const cardElement = elements.getElement(react_stripe_js_1.CardElement);
        if (!cardElement)
            return;
        try {
            setLoading(true);
            setError(null);
            // Créer une session de paiement
            const { data, error: sessionError } = yield supabase_1.supabase.functions.invoke('create-payment-intent', {
                body: {
                    userId: user.id,
                    priceId,
                    planName,
                },
            });
            if (sessionError)
                throw sessionError;
            if (!(data === null || data === void 0 ? void 0 : data.clientSecret))
                throw new Error('Impossible de créer la session de paiement');
            // Confirmer le paiement
            const { error: stripeError } = yield stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        email: user.email,
                    },
                },
            });
            if (stripeError) {
                throw new Error(stripeError.message);
            }
            // Recharger les informations utilisateur
            yield loadUser();
            // Réinitialiser le formulaire
            cardElement.clear();
            // Appeler le callback de succès
            if (onSuccess)
                onSuccess();
        }
        catch (error) {
            console.error('Error processing payment:', error);
            setError(error.message || 'Une erreur est survenue');
        }
        finally {
            setLoading(false);
        }
    });
    return ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Carte de cr\u00E9dit" }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white/5 border border-white/10 rounded-lg p-4", children: (0, jsx_runtime_1.jsx)(react_stripe_js_1.CardElement, { options: {
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#ffffff',
                                        '::placeholder': {
                                            color: '#aab7c4',
                                        },
                                    },
                                    invalid: {
                                        color: '#ef4444',
                                    },
                                },
                            } }) })] }), error && ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-900/50 text-red-400 p-4 rounded-lg", children: error })), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end gap-4", children: [onCancel && ((0, jsx_runtime_1.jsx)("button", { type: "button", onClick: onCancel, className: "btn-secondary", children: "Annuler" })), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: !stripe || loading, className: "btn-primary", children: loading ? 'Traitement en cours...' : `S'abonner à ${planName}` })] })] }));
}
function CheckoutForm(props) {
    return ((0, jsx_runtime_1.jsx)(react_stripe_js_1.Elements, { stripe: stripePromise, children: (0, jsx_runtime_1.jsx)(CheckoutFormInner, Object.assign({}, props)) }));
}
