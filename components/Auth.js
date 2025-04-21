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
exports.Auth = Auth;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const react_i18next_1 = require("react-i18next");
const react_router_dom_1 = require("react-router-dom");
const PasswordStrengthMeter_1 = require("./PasswordStrengthMeter");
const auth_service_1 = require("../lib/auth-service");
function Auth() {
    var _a, _b;
    const [isLogin, setIsLogin] = (0, react_1.useState)(true);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [fullName, setFullName] = (0, react_1.useState)('');
    const [message, setMessage] = (0, react_1.useState)(null);
    const [showHelp, setShowHelp] = (0, react_1.useState)(false);
    const { t } = (0, react_i18next_1.useTranslation)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const location = (0, react_router_dom_1.useLocation)();
    // Récupérer l'URL de redirection si elle existe
    const from = ((_b = (_a = location.state) === null || _a === void 0 ? void 0 : _a.from) === null || _b === void 0 ? void 0 : _b.pathname) || '/dashboard';
    // Vérifier si l'utilisateur est déjà connecté
    (0, react_1.useEffect)(() => {
        const checkSession = () => __awaiter(this, void 0, void 0, function* () {
            const { session } = yield auth_service_1.AuthService.getSession();
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
            const { user, error } = yield auth_service_1.AuthService.signUp(email, password, fullName);
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
            const { user, error } = yield auth_service_1.AuthService.signIn(email, password);
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
            const { error } = yield auth_service_1.AuthService.resetPassword(email);
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
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8", children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "max-w-md w-full space-y-8", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "mt-6 text-center text-3xl font-extrabold text-white", children: isLogin ? t('auth.login') : t('auth.signup') }), (0, jsx_runtime_1.jsxs)("p", { className: "mt-2 text-center text-sm text-gray-400", children: [t('common.or'), ' ', (0, jsx_runtime_1.jsx)("a", { href: "/pricing", className: "font-medium text-primary-400 hover:text-primary-300", children: t('auth.startTrial') })] })] }), (0, jsx_runtime_1.jsxs)("form", { className: "mt-8 space-y-6", onSubmit: isLogin ? handleSignIn : handleSignUp, children: [(0, jsx_runtime_1.jsxs)("div", { className: "rounded-md shadow-sm -space-y-px", children: [!isLogin && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "full-name", className: "sr-only", children: "Nom complet" }), (0, jsx_runtime_1.jsx)("input", { id: "full-name", name: "fullName", type: "text", autoComplete: "name", value: fullName, onChange: (e) => {
                                                setFullName(e.target.value);
                                                setMessage(null);
                                            }, className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-white/10 placeholder-gray-400 text-white rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white/5", placeholder: "Nom complet" })] })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "email-address", className: "sr-only", children: t('auth.email') }), (0, jsx_runtime_1.jsx)("input", { id: "email-address", name: "email", type: "email", autoComplete: "email", required: true, value: email, onChange: (e) => {
                                                setEmail(e.target.value);
                                                setMessage(null);
                                            }, className: `appearance-none rounded-none relative block w-full px-3 py-2 border border-white/10 placeholder-gray-400 text-white ${isLogin && !fullName ? 'rounded-t-md' : ''} focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white/5`, placeholder: t('auth.email') })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "password", className: "sr-only", children: t('auth.password') }), (0, jsx_runtime_1.jsx)("input", { id: "password", name: "password", type: "password", autoComplete: isLogin ? "current-password" : "new-password", required: true, value: password, onChange: (e) => {
                                                setPassword(e.target.value);
                                                setMessage(null);
                                            }, className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-white/10 placeholder-gray-400 text-white rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-white/5", placeholder: t('auth.password') })] })] }), !isLogin && (0, jsx_runtime_1.jsx)(PasswordStrengthMeter_1.PasswordStrengthMeter, { password: password }), message && ((0, jsx_runtime_1.jsx)("div", { className: `rounded-md p-4 ${message.type === 'error' ? 'bg-red-900/50 text-red-400' : 'bg-green-900/50 text-green-400'}`, role: "alert", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm", children: message.text }) })), showHelp && isLogin && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-blue-900/50 text-blue-400 p-4 rounded-md", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium mb-2", children: "Besoin d'aide pour vous connecter ?" }), (0, jsx_runtime_1.jsxs)("ul", { className: "text-xs space-y-1 list-disc list-inside", children: [(0, jsx_runtime_1.jsx)("li", { children: "V\u00E9rifiez que votre adresse email est correcte" }), (0, jsx_runtime_1.jsx)("li", { children: "Assurez-vous que le verrouillage des majuscules est d\u00E9sactiv\u00E9" }), (0, jsx_runtime_1.jsx)("li", { children: "Si vous avez oubli\u00E9 votre mot de passe, utilisez le lien \"Mot de passe oubli\u00E9\"" }), (0, jsx_runtime_1.jsx)("li", { children: "Si vous n'avez pas encore de compte, cliquez sur \"Cr\u00E9er un compte\"" })] })] })), isLogin && ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between", children: (0, jsx_runtime_1.jsx)("div", { className: "text-sm", children: (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: handleForgotPassword, className: "font-medium text-primary-400 hover:text-primary-300", children: t('auth.forgotPassword') }) }) })), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: loading, className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white btn-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? t('common.loading') : isLogin ? t('auth.login') : t('auth.createAccount') }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => {
                                        setIsLogin(!isLogin);
                                        setMessage(null);
                                        setShowHelp(false);
                                    }, className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white btn-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500", children: isLogin ? "Créer un compte" : "Déjà inscrit ? Se connecter" })] })] })] }) }));
}
