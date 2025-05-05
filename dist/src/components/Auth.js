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
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { AuthService } from '../lib/auth-service';
const Auth = () => {
    var _a, _b;
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [message, setMessage] = useState(null);
    const [showHelp, setShowHelp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [termsError, setTermsError] = useState(null);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    // Récupérer l'URL de redirection si elle existe
    const from = ((_b = (_a = location.state) === null || _a === void 0 ? void 0 : _a.from) === null || _b === void 0 ? void 0 : _b.pathname) || '/dashboard';
    // Vérifier si l'utilisateur est déjà connecté
    useEffect(() => {
        const checkSession = () => __awaiter(void 0, void 0, void 0, function* () {
            const { session } = yield AuthService.getSession();
            if (session) {
                navigate('/dashboard');
            }
        });
        checkSession();
    }, [navigate]);
    const handleSignUp = (e) => __awaiter(void 0, void 0, void 0, function* () {
        setTermsError(null);
        if (!acceptTerms) {
            setTermsError(t('auth.errors.acceptTerms'));
            return;
        }
        e.preventDefault();
        setMessage(null);
        if (!email || !password) {
            setMessage({ type: 'error', text: t('auth.errors.requiredFields') });
            return;
        }
        if (password.length < 12) {
            setMessage({ type: 'error', text: t('auth.errors.passwordLength') });
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
                setMessage({ type: 'error', text: t('auth.errors.signup') });
                return;
            }
            setMessage({ type: 'success', text: t('auth.success.signup') });
            setTimeout(() => {
                navigate('/pricing');
            }, 2000);
        }
        catch (error) {
            console.error('Error signing up:', error);
            setMessage({ type: 'error', text: (error === null || error === void 0 ? void 0 : error.message) || t('auth.errors.unknown') });
        }
        finally {
            setLoading(false);
        }
    });
    const handleSignIn = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        setMessage(null);
        setShowHelp(false);
        if (!email || !password) {
            setMessage({ type: 'error', text: t('auth.errors.requiredFields') });
            return;
        }
        if (password.length < 12) {
            setMessage({ type: 'error', text: t('auth.errors.passwordLength') });
            return;
        }
        try {
            setLoading(true);
            const { user, error } = yield AuthService.signIn(email, password);
            if (error) {
                // Mapping des messages d’erreur Supabase vers des clés i18n si possible
                let errorKey = '';
                if (error.message === 'Invalid login credentials')
                    errorKey = 'auth.errors.login';
                if (error.message === 'User already registered')
                    errorKey = 'auth.errors.signup';
                if (error.message === 'Password should be at least 12 characters')
                    errorKey = 'auth.errors.passwordLength';
                setMessage({ type: 'error', text: errorKey !== '' ? t(errorKey) : error.message || t('auth.errors.unknown') });
                setShowHelp(true);
                return;
            }
            if (!user) {
                setMessage({ type: 'error', text: t('auth.errors.login') });
                setShowHelp(true);
                return;
            }
            setMessage({ type: 'success', text: t('auth.success.login') });
            navigate(from);
        }
        catch (error) {
            // Mapping des messages d’erreur JS génériques
            let errorKey = '';
            if ((error === null || error === void 0 ? void 0 : error.message) === 'Invalid login credentials')
                errorKey = 'auth.errors.login';
            if ((error === null || error === void 0 ? void 0 : error.message) === 'User already registered')
                errorKey = 'auth.errors.signup';
            if ((error === null || error === void 0 ? void 0 : error.message) === 'Password should be at least 12 characters')
                errorKey = 'auth.errors.passwordLength';
            setMessage({ type: 'error', text: errorKey !== '' ? t(errorKey) : (error === null || error === void 0 ? void 0 : error.message) || t('auth.errors.unknown') });
            setShowHelp(true);
        }
        finally {
            setLoading(false);
        }
    });
    const handleForgotPassword = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!email) {
            setMessage({ type: 'error', text: t('auth.errors.emailRequired') });
            return;
        }
        try {
            setLoading(true);
            const { error } = yield AuthService.resetPassword(email);
            if (error) {
                setMessage({ type: 'error', text: error.message });
                return;
            }
            setMessage({ type: 'success', text: t('auth.success.reset') });
        }
        catch (error) {
            setMessage({ type: 'error', text: (error === null || error === void 0 ? void 0 : error.message) || t('auth.errors.unknown') });
        }
        finally {
            setLoading(false);
        }
    });
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "max-w-md w-full space-y-8", children: [_jsxs("div", { children: [_jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-white", children: isLogin ? t('auth.login') : t('auth.signup') }), _jsxs("p", { className: "mt-2 text-center text-sm text-gray-400", children: [t('common.or'), ' ', _jsx("a", { href: "/pricing", className: "font-medium text-primary-400 hover:text-primary-300", children: t('auth.startTrial') })] })] }), _jsxs("form", { className: "mt-8 space-y-6", onSubmit: isLogin ? handleSignIn : handleSignUp, children: [!isLogin && (_jsxs("div", { className: "flex items-center mb-2", children: [_jsx("input", { id: "accept-terms", name: "acceptTerms", type: "checkbox", checked: acceptTerms, onChange: e => setAcceptTerms(e.target.checked), className: "h-4 w-4 text-primary-600 focus:ring-primary-500 border-white/10 rounded", required: true }), _jsxs("label", { htmlFor: "accept-terms", className: "ml-2 block text-sm text-gray-300", children: [t('auth.acceptTerms'), ' ', _jsx("a", { href: "/cgu", target: "_blank", rel: "noopener noreferrer", className: "underline text-primary-400 hover:text-primary-300", children: t('auth.termsLink') })] })] })), termsError && (_jsx("div", { className: "bg-red-900/50 text-red-400 p-2 rounded mb-2 text-sm", children: termsError })), _jsxs("div", { className: "rounded-md shadow-sm -space-y-px", children: [!isLogin && (_jsxs("div", { children: [_jsx("label", { htmlFor: "full-name", className: "sr-only", children: t('auth.fullName') }), _jsx("input", { id: "full-name", name: "fullName", type: "text", autoComplete: "name", value: fullName, onChange: (e) => {
                                                setFullName(e.target.value);
                                                setMessage(null);
                                            }, className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-white/10 placeholder-gray-400 text-white rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white/5", placeholder: t('auth.fullName') })] })), _jsxs("div", { children: [_jsx("label", { htmlFor: "email-address", className: "sr-only", children: t('auth.email') }), _jsx("input", { id: "email-address", name: "email", type: "email", autoComplete: "email", required: true, value: email, onChange: (e) => {
                                                setEmail(e.target.value);
                                                setMessage(null);
                                            }, className: `appearance-none rounded-none relative block w-full px-3 py-2 border border-white/10 placeholder-gray-400 text-white ${isLogin && !fullName ? 'rounded-t-md' : ''} focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white/5`, placeholder: t('auth.email') })] }), _jsxs("div", { className: "relative", children: [_jsx("label", { htmlFor: "password", className: "sr-only", children: t('auth.password') }), _jsx("input", { id: "password", name: "password", type: showPassword ? 'text' : 'password', autoComplete: isLogin ? 'current-password' : 'new-password', required: true, minLength: 9, value: password, onChange: (e) => {
                                                setPassword(e.target.value);
                                                setMessage(null);
                                            }, className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-white/10 placeholder-gray-400 text-white rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white/5 pr-10", placeholder: t('auth.password') }), _jsx("button", { type: "button", tabIndex: -1, "aria-label": showPassword ? t('auth.hidePassword') : t('auth.showPassword'), onClick: () => setShowPassword((v) => !v), className: "absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-primary-400 focus:outline-none", style: { background: 'none', border: 'none' }, children: showPassword ? (_jsx(EyeSlashIcon, { className: "h-5 w-5", "aria-hidden": "true" })) : (_jsx(EyeIcon, { className: "h-5 w-5", "aria-hidden": "true" })) })] })] }), !isLogin && _jsx(PasswordStrengthMeter, { password: password }), message && (_jsx("div", { className: `rounded-md p-4 ${message.type === 'error' ? 'bg-red-900/50 text-red-400' : 'bg-green-900/50 text-green-400'}`, role: "alert", children: _jsx("p", { className: "text-sm", children: message.text }) })), showHelp && isLogin && (_jsxs("div", { className: "bg-blue-900/50 text-blue-400 p-4 rounded-md", children: [_jsx("h4", { className: "text-sm font-medium mb-2", children: t('auth.help.title') }), _jsxs("ul", { className: "text-xs space-y-1 list-disc list-inside", children: [_jsx("li", { children: t('auth.help.checkEmail') }), _jsx("li", { children: t('auth.help.capsLock') }), _jsx("li", { children: t('auth.help.forgotPassword') }), _jsx("li", { children: t('auth.help.noAccount') })] })] })), _jsxs("div", { className: "space-y-3", children: [_jsx("button", { type: "submit", disabled: loading, className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white btn-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? t('common.loading') : isLogin ? t('auth.login') : t('auth.createAccount') }), _jsx("button", { type: "button", onClick: () => {
                                        setIsLogin(!isLogin);
                                        setMessage(null);
                                        setShowHelp(false);
                                    }, className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white btn-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500", children: isLogin ? t('auth.createAccount') : t('auth.alreadyRegistered') })] })] })] }) }));
};
export default Auth;
