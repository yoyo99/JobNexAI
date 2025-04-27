var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements, } from '@stripe/react-stripe-js';
import { supabase } from '../lib/supabase';
import { useAuth } from '../stores/auth';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
function PaymentMethodFormInner({ onSuccess, onCancel }) {
    const { user } = useAuth();
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        if (!stripe || !elements || !user) {
            return;
        }
        const cardElement = elements.getElement(CardElement);
        if (!cardElement)
            return;
        try {
            setLoading(true);
            setError(null);
            // Créer une méthode de paiement
            const { error: stripeError, paymentMethod } = yield stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });
            if (stripeError) {
                throw new Error(stripeError.message);
            }
            if (!paymentMethod) {
                throw new Error('Impossible de créer la méthode de paiement');
            }
            // Enregistrer la méthode de paiement via une fonction Edge
            const { error } = yield supabase.functions.invoke('attach-payment-method', {
                body: {
                    userId: user.id,
                    paymentMethodId: paymentMethod.id,
                },
            });
            if (error)
                throw error;
            // Réinitialiser le formulaire
            cardElement.clear();
            // Appeler le callback de succès
            if (onSuccess)
                onSuccess();
        }
        catch (error) {
            console.error('Error adding payment method:', error);
            setError(error.message || 'Une erreur est survenue');
        }
        finally {
            setLoading(false);
        }
    });
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Carte de cr\u00E9dit" }), _jsx("div", { className: "bg-white/5 border border-white/10 rounded-lg p-4", children: _jsx(CardElement, { options: {
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
                            } }) })] }), error && (_jsx("div", { className: "bg-red-900/50 text-red-400 p-4 rounded-lg", children: error })), _jsxs("div", { className: "flex justify-end gap-4", children: [onCancel && (_jsx("button", { type: "button", onClick: onCancel, className: "btn-secondary", children: "Annuler" })), _jsx("button", { type: "submit", disabled: !stripe || loading, className: "btn-primary", children: loading ? 'Traitement en cours...' : 'Ajouter la carte' })] })] }));
}
export function PaymentMethodForm(props) {
    return (_jsx(Elements, { stripe: stripePromise, children: _jsx(PaymentMethodFormInner, Object.assign({}, props)) }));
}
