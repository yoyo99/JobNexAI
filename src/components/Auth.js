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
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { AuthService } from '../lib/auth-service';
export function Auth() {
    var _a, _b;
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [message, setMessage] = useState(null);
    const [showHelp, setShowHelp] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    // Récupérer l'URL de redirection si elle existe
    const from = ((_b = (_a = location.state) === null || _a === void 0 ? void 0 : _a.from) === null || _b === void 0 ? void 0 : _b.pathname) || '/dashboard';
    // Vérifier si l'utilisateur est déjà connecté
    useEffect(() => {
        const checkSession = () => __awaiter(this, void 0, void 0, function* () {
            const { session } = yield AuthService.getSession();
            if (session) {
                navigate('/dashboard');
            }
        });
        checkSession();
    }, [navigate]);
    const handleSignUp = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setMessage(null);
        if (!email || !password) {
            setMessage({ type: 'error', text: 'Veuillez remplir tous les champs' });
            return;
        }
        try {
            setLoading(true);
            const { user, error } = yield AuthService.signUp(email, password, fullName);
            if (error) {
                setMessage({ type: 'error', text: error.message });
                return;
            }
            if (!user) {
                setMessage({ type: 'error', text: 'Une erreur est survenue lors de l\'inscription' });
                return;
            }
            setMessage({
                type: 'success',
                text: 'Inscription réussie ! Vous pouvez maintenant vous connecter.'
            });
            // Rediriger vers la page de tarification après un court délai
            setTimeout(() => {
                navigate('/pricing');
            }, 2000);
        }
        catch (error) {
            console.error('Error signing up:', error);
            setMessage({ type: 'error', text: error.message || 'Une erreur est survenue' });
        }
        finally {
            setLoading(false);
        }
    });
    const handleSignIn = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setMessage(null);
        setShowHelp(false);
        if (!email || !password) {
            setMessage({ type: 'error', text: 'Veuillez remplir tous les champs' });
            return;
        }
        try {
            setLoading(true);
            const { user, error } = yield AuthService.signIn(email, password);
            if (error) {
                setMessage({ type: 'error', text: error.message });
                setShowHelp(true);
                return;
            }
            if (!user) {
                setMessage({ type: 'error', text: 'Une erreur est survenue lors de la connexion' });
                return;
            }
            setMessage({ type: 'success', text: 'Connexion réussie !' });
            // Rediriger vers le dashboard ou la page précédente
            navigate(from);
        }
        catch (error) {
            console.error('Error signing in:', error);
            setMessage({ type: 'error', text: error.message || 'Une erreur est survenue' });
            setShowHelp(true);
        }
        finally {
            setLoading(false);
        }
    });
    const handleForgotPassword = () => __awaiter(this, void 0, void 0, function* () {
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
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "max-w-md w-full space-y-8", children: [_jsxs("div", { children: [_jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-white", children: isLogin ? t('auth.login') : t('auth.signup') }), _jsxs("p", { className: "mt-2 text-center text-sm text-gray-400", children: [t('common.or'), ' ', _jsx("a", { href: "/pricing", className: "font-medium text-primary-400 hover:text-primary-300", children: t('auth.startTrial') })] })] }), _jsxs("form", { className: "mt-8 space-y-6", onSubmit: isLogin ? handleSignIn : handleSignUp, children: [_jsxs("div", { className: "rounded-md shadow-sm -space-y-px", children: [!isLogin && (_jsxs("div", { children: [_jsx("label", { htmlFor: "full-name", className: "sr-only", children: "Nom complet" }), _jsx("input", { id: "full-name", name: "fullName", type: "text", autoComplete: "name", value: fullName, onChange: (e) => {
                                                setFullName(e.target.value);
                                                setMessage(null);
                                            }, className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-white/10 placeholder-gray-400 text-white rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white/5", placeholder: "Nom complet" })] })), _jsxs("div", { children: [_jsx("label", { htmlFor: "email-address", className: "sr-only", children: t('auth.email') }), _jsx("input", { id: "email-address", name: "email", type: "email", autoComplete: "email", required: true, value: email, onChange: (e) => {
                                                setEmail(e.target.value);
                                                setMessage(null);
                                            }, className: `appearance-none rounded-none relative block w-full px-3 py-2 border border-white/10 placeholder-gray-400 text-white ${isLogin && !fullName ? 'rounded-t-md' : ''} focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white/5`, placeholder: t('auth.email') })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "sr-only", children: t('auth.password') }), _jsx("input", { id: "password", name: "password", type: "password", autoComplete: isLogin ? "current-password" : "new-password", required: true, value: password, onChange: (e) => {
                                                setPassword(e.target.value);
                                                setMessage(null);
                                            }, className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-white/10 placeholder-gray-400 text-white rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white/5", placeholder: t('auth.password') })] })] }), !isLogin && _jsx(PasswordStrengthMeter, { password: password }), message && (_jsx("div", { className: `rounded-md p-4 ${message.type === 'error' ? 'bg-red-900/50 text-red-400' : 'bg-green-900/50 text-green-400'}`, role: "alert", children: _jsx("p", { className: "text-sm", children: message.text }) })), showHelp && isLogin && (_jsxs("div", { className: "bg-blue-900/50 text-blue-400 p-4 rounded-md", children: [_jsx("h4", { className: "text-sm font-medium mb-2", children: "Besoin d'aide pour vous connecter ?" }), _jsxs("ul", { className: "text-xs space-y-1 list-disc list-inside", children: [_jsx("li", { children: "V\u00E9rifiez que votre adresse email est correcte" }), _jsx("li", { children: "Assurez-vous que le verrouillage des majuscules est d\u00E9sactiv\u00E9" }), _jsx("li", { children: "Si vous avez oubli\u00E9 votre mot de passe, utilisez le lien \"Mot de passe oubli\u00E9\"" }), _jsx("li", { children: "Si vous n'avez pas encore de compte, cliquez sur \"Cr\u00E9er un compte\"" })] })] })), isLogin && (_jsx("div", { className: "flex items-center justify-between", children: _jsx("div", { className: "text-sm", children: _jsx("button", { type: "button", onClick: handleForgotPassword, className: "font-medium text-primary-400 hover:text-primary-300", children: t('auth.forgotPassword') }) }) })), _jsxs("div", { className: "space-y-3", children: [_jsx("button", { type: "submit", disabled: loading, className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white btn-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? t('common.loading') : isLogin ? t('auth.login') : t('auth.createAccount') }), _jsx("button", { type: "button", onClick: () => {
                                        setIsLogin(!isLogin);
                                        setMessage(null);
                                        setShowHelp(false);
                                    }, className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white btn-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500", children: isLogin ? "Créer un compte" : "Déjà inscrit ? Se connecter" })] })] })] }) }));
}
