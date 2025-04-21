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
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../lib/auth-service';
export function ForgotPassword() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const handleResetPassword = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setMessage(null);
        if (!email) {
            setMessage({ type: 'error', text: 'Veuillez entrer votre adresse email' });
            return;
        }
        try {
            setLoading(true);
            const { error } = yield AuthService.resetPassword(email);
            if (error) {
                setMessage({ type: 'error', text: error.message });
                return;
            }
            setMessage({
                type: 'success',
                text: 'Instructions de réinitialisation envoyées à votre adresse email'
            });
        }
        catch (error) {
            console.error('Error resetting password:', error);
            setMessage({ type: 'error', text: error.message || 'Une erreur est survenue' });
        }
        finally {
            setLoading(false);
        }
    });
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "max-w-md w-full space-y-8", children: [_jsxs("div", { children: [_jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-white", children: "Mot de passe oubli\u00E9" }), _jsx("p", { className: "mt-2 text-center text-sm text-gray-400", children: "Entrez votre adresse email pour recevoir les instructions de r\u00E9initialisation" })] }), _jsxs("form", { className: "mt-8 space-y-6", onSubmit: handleResetPassword, children: [_jsx("div", { className: "rounded-md shadow-sm -space-y-px", children: _jsxs("div", { children: [_jsx("label", { htmlFor: "email-address", className: "sr-only", children: t('auth.email') }), _jsx("input", { id: "email-address", name: "email", type: "email", autoComplete: "email", required: true, value: email, onChange: (e) => {
                                            setEmail(e.target.value);
                                            setMessage(null);
                                        }, className: "appearance-none rounded-md relative block w-full px-3 py-2 border border-white/10 placeholder-gray-400 text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white/5", placeholder: t('auth.email') })] }) }), message && (_jsx("div", { className: `rounded-md p-4 ${message.type === 'error' ? 'bg-red-900/50 text-red-400' : 'bg-green-900/50 text-green-400'}`, role: "alert", children: _jsx("p", { className: "text-sm", children: message.text }) })), _jsxs("div", { className: "space-y-3", children: [_jsx("button", { type: "submit", disabled: loading, className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white btn-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? t('common.loading') : 'Envoyer les instructions' }), _jsx("button", { type: "button", onClick: () => navigate('/login'), className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white btn-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500", children: "Retour \u00E0 la connexion" })] })] })] }) }));
}
