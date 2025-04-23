var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../stores/auth';
import { supabase } from '../lib/supabase';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { PaymentMethodForm } from './PaymentMethodForm';
export function PaymentMethodList() {
    const { user } = useAuth();
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    useEffect(() => {
        if (user) {
            loadPaymentMethods();
        }
    }, [user]);
    const loadPaymentMethods = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            setError(null);
            const { data, error } = yield supabase.functions.invoke('list-payment-methods', {
                body: { userId: user === null || user === void 0 ? void 0 : user.id }
            });
            if (error)
                throw error;
            setPaymentMethods(data || []);
        }
        catch (error) {
            console.error('Error loading payment methods:', error);
            setError(error.message || 'Une erreur est survenue');
        }
        finally {
            setLoading(false);
        }
    });
    const handleDeletePaymentMethod = (paymentMethodId) => __awaiter(this, void 0, void 0, function* () {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette méthode de paiement ?')) {
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const { error } = yield supabase.functions.invoke('detach-payment-method', {
                body: {
                    userId: user === null || user === void 0 ? void 0 : user.id,
                    paymentMethodId
                }
            });
            if (error)
                throw error;
            // Recharger les méthodes de paiement
            yield loadPaymentMethods();
        }
        catch (error) {
            console.error('Error deleting payment method:', error);
            setError(error.message || 'Une erreur est survenue');
        }
        finally {
            setLoading(false);
        }
    });
    const handleSetDefaultPaymentMethod = (paymentMethodId) => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            setError(null);
            const { error } = yield supabase.functions.invoke('set-default-payment-method', {
                body: {
                    userId: user === null || user === void 0 ? void 0 : user.id,
                    paymentMethodId
                }
            });
            if (error)
                throw error;
            // Recharger les méthodes de paiement
            yield loadPaymentMethods();
        }
        catch (error) {
            console.error('Error setting default payment method:', error);
            setError(error.message || 'Une erreur est survenue');
        }
        finally {
            setLoading(false);
        }
    });
    const handleAddPaymentMethodSuccess = () => {
        setShowAddForm(false);
        loadPaymentMethods();
    };
    if (loading && paymentMethods.length === 0) {
        return (_jsx("div", { className: "flex justify-center py-6", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-medium text-white", children: "M\u00E9thodes de paiement" }), _jsx("button", { onClick: () => setShowAddForm(!showAddForm), className: "btn-secondary flex items-center gap-2", children: showAddForm ? 'Annuler' : (_jsxs(_Fragment, { children: [_jsx(PlusIcon, { className: "h-5 w-5" }), "Ajouter une carte"] })) })] }), error && (_jsx("div", { className: "bg-red-900/50 text-red-400 p-4 rounded-lg", children: error })), showAddForm ? (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "bg-white/5 rounded-lg p-6", children: _jsx(PaymentMethodForm, { onSuccess: handleAddPaymentMethodSuccess, onCancel: () => setShowAddForm(false) }) })) : (_jsx(_Fragment, { children: paymentMethods.length === 0 ? (_jsxs("div", { className: "bg-white/5 rounded-lg p-6 text-center", children: [_jsx("p", { className: "text-gray-400", children: "Aucune m\u00E9thode de paiement enregistr\u00E9e" }), _jsx("button", { onClick: () => setShowAddForm(true), className: "btn-primary mt-4", children: "Ajouter une carte" })] })) : (_jsx("div", { className: "space-y-4", children: paymentMethods.map((method) => (_jsxs("div", { className: "bg-white/5 rounded-lg p-4 flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-white font-medium capitalize", children: method.brand }), _jsxs("span", { className: "text-gray-400", children: ["\u2022\u2022\u2022\u2022 ", method.last4] }), method.is_default && (_jsx("span", { className: "bg-primary-600/20 text-primary-400 text-xs px-2 py-1 rounded-full", children: "Par d\u00E9faut" }))] }), _jsxs("p", { className: "text-sm text-gray-400", children: ["Expire ", method.exp_month.toString().padStart(2, '0'), "/", method.exp_year] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [!method.is_default && (_jsx("button", { onClick: () => handleSetDefaultPaymentMethod(method.id), className: "text-sm text-primary-400 hover:text-primary-300", disabled: loading, children: "D\u00E9finir par d\u00E9faut" })), _jsx("button", { onClick: () => handleDeletePaymentMethod(method.id), className: "text-gray-400 hover:text-red-400", disabled: loading, children: _jsx(TrashIcon, { className: "h-5 w-5" }) })] })] }, method.id))) })) }))] }));
}
