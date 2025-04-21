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
exports.PaymentMethodList = PaymentMethodList;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const auth_1 = require("../stores/auth");
const supabase_1 = require("../lib/supabase");
const outline_1 = require("@heroicons/react/24/outline");
const PaymentMethodForm_1 = require("./PaymentMethodForm");
function PaymentMethodList() {
    const { user } = (0, auth_1.useAuth)();
    const [paymentMethods, setPaymentMethods] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [showAddForm, setShowAddForm] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (user) {
            loadPaymentMethods();
        }
    }, [user]);
    const loadPaymentMethods = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            setError(null);
            const { data, error } = yield supabase_1.supabase.functions.invoke('list-payment-methods', {
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
            const { error } = yield supabase_1.supabase.functions.invoke('detach-payment-method', {
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
            const { error } = yield supabase_1.supabase.functions.invoke('set-default-payment-method', {
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
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center py-6", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-white", children: "M\u00E9thodes de paiement" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setShowAddForm(!showAddForm), className: "btn-secondary flex items-center gap-2", children: showAddForm ? 'Annuler' : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(outline_1.PlusIcon, { className: "h-5 w-5" }), "Ajouter une carte"] })) })] }), error && ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-900/50 text-red-400 p-4 rounded-lg", children: error })), showAddForm ? ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "bg-white/5 rounded-lg p-6", children: (0, jsx_runtime_1.jsx)(PaymentMethodForm_1.PaymentMethodForm, { onSuccess: handleAddPaymentMethodSuccess, onCancel: () => setShowAddForm(false) }) })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: paymentMethods.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/5 rounded-lg p-6 text-center", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "Aucune m\u00E9thode de paiement enregistr\u00E9e" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setShowAddForm(true), className: "btn-primary mt-4", children: "Ajouter une carte" })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: paymentMethods.map((method) => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/5 rounded-lg p-4 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-white font-medium capitalize", children: method.brand }), (0, jsx_runtime_1.jsxs)("span", { className: "text-gray-400", children: ["\u2022\u2022\u2022\u2022 ", method.last4] }), method.is_default && ((0, jsx_runtime_1.jsx)("span", { className: "bg-primary-600/20 text-primary-400 text-xs px-2 py-1 rounded-full", children: "Par d\u00E9faut" }))] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-400", children: ["Expire ", method.exp_month.toString().padStart(2, '0'), "/", method.exp_year] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [!method.is_default && ((0, jsx_runtime_1.jsx)("button", { onClick: () => handleSetDefaultPaymentMethod(method.id), className: "text-sm text-primary-400 hover:text-primary-300", disabled: loading, children: "D\u00E9finir par d\u00E9faut" })), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleDeletePaymentMethod(method.id), className: "text-gray-400 hover:text-red-400", disabled: loading, children: (0, jsx_runtime_1.jsx)(outline_1.TrashIcon, { className: "h-5 w-5" }) })] })] }, method.id))) })) }))] }));
}
