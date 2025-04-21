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
exports.ResetPassword = ResetPassword;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const react_i18next_1 = require("react-i18next");
const react_router_dom_1 = require("react-router-dom");
const PasswordStrengthMeter_1 = require("./PasswordStrengthMeter");
const auth_service_1 = require("../lib/auth-service");
function ResetPassword() {
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [password, setPassword] = (0, react_1.useState)('');
    const [confirmPassword, setConfirmPassword] = (0, react_1.useState)('');
    const [message, setMessage] = (0, react_1.useState)(null);
    const { t } = (0, react_i18next_1.useTranslation)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleResetPassword = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setMessage(null);
        if (!password || !confirmPassword) {
            setMessage({ type: 'error', text: 'Veuillez remplir tous les champs' });
            return;
        }
        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
            return;
        }
        try {
            setLoading(true);
            const { error } = yield auth_service_1.AuthService.updatePassword(password);
            if (error) {
                setMessage({ type: 'error', text: error.message });
                return;
            }
            setMessage({ type: 'success', text: 'Votre mot de passe a été mis à jour avec succès' });
            // Rediriger vers la page de connexion après un court délai
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }
        catch (error) {
            console.error('Error resetting password:', error);
            setMessage({ type: 'error', text: error.message || 'Une erreur est survenue' });
        }
        finally {
            setLoading(false);
        }
    });
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8", children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "max-w-md w-full space-y-8", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "mt-6 text-center text-3xl font-extrabold text-white", children: "R\u00E9initialiser votre mot de passe" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-center text-sm text-gray-400", children: "Veuillez choisir un nouveau mot de passe s\u00E9curis\u00E9" })] }), (0, jsx_runtime_1.jsxs)("form", { className: "mt-8 space-y-6", onSubmit: handleResetPassword, children: [(0, jsx_runtime_1.jsxs)("div", { className: "rounded-md shadow-sm -space-y-px", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "password", className: "sr-only", children: "Nouveau mot de passe" }), (0, jsx_runtime_1.jsx)("input", { id: "password", name: "password", type: "password", autoComplete: "new-password", required: true, value: password, onChange: (e) => {
                                                setPassword(e.target.value);
                                                setMessage(null);
                                            }, className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-white/10 placeholder-gray-400 text-white rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white/5", placeholder: "Nouveau mot de passe" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "confirm-password", className: "sr-only", children: "Confirmer le mot de passe" }), (0, jsx_runtime_1.jsx)("input", { id: "confirm-password", name: "confirmPassword", type: "password", autoComplete: "new-password", required: true, value: confirmPassword, onChange: (e) => {
                                                setConfirmPassword(e.target.value);
                                                setMessage(null);
                                            }, className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-white/10 placeholder-gray-400 text-white rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white/5", placeholder: "Confirmer le mot de passe" })] })] }), (0, jsx_runtime_1.jsx)(PasswordStrengthMeter_1.PasswordStrengthMeter, { password: password }), message && ((0, jsx_runtime_1.jsx)("div", { className: `rounded-md p-4 ${message.type === 'error' ? 'bg-red-900/50 text-red-400' : 'bg-green-900/50 text-green-400'}`, role: "alert", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm", children: message.text }) })), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: loading, className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white btn-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? t('common.loading') : 'Réinitialiser le mot de passe' }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => navigate('/login'), className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white btn-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500", children: "Retour \u00E0 la connexion" })] })] })] }) }));
}
