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
exports.StripeCheckoutStatus = StripeCheckoutStatus;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const framer_motion_1 = require("framer-motion");
const stripe_service_1 = require("../lib/stripe-service");
const auth_1 = require("../stores/auth");
const LoadingSpinner_1 = require("./LoadingSpinner");
const outline_1 = require("@heroicons/react/24/outline");
function StripeCheckoutStatus() {
    const [status, setStatus] = (0, react_1.useState)('loading');
    const [message, setMessage] = (0, react_1.useState)('');
    const location = (0, react_router_dom_1.useLocation)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { loadUser } = (0, auth_1.useAuth)();
    (0, react_1.useEffect)(() => {
        const checkStatus = () => __awaiter(this, void 0, void 0, function* () {
            try {
                // Get session_id from URL
                const params = new URLSearchParams(location.search);
                const sessionId = params.get('session_id');
                if (!sessionId) {
                    setStatus('error');
                    setMessage('Aucun identifiant de session trouvé');
                    return;
                }
                // Check session status
                const { success, data, error } = yield stripe_service_1.StripeService.checkSessionStatus(sessionId);
                if (!success || error) {
                    setStatus('error');
                    setMessage(error || 'Une erreur est survenue lors de la vérification du paiement');
                    return;
                }
                // Reload user data to get updated subscription
                yield loadUser();
                // Set success status
                setStatus('success');
                setMessage('Votre abonnement a été activé avec succès');
                // Redirect to dashboard after a delay
                setTimeout(() => {
                    navigate('/dashboard');
                }, 3000);
            }
            catch (error) {
                setStatus('error');
                setMessage(error.message || 'Une erreur est survenue lors de la vérification du paiement');
            }
        });
        checkStatus();
    }, [location, navigate, loadUser]);
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen flex items-center justify-center bg-background", children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card max-w-md w-full text-center p-8", children: [status === 'loading' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { size: "lg", className: "mb-4" }), (0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-bold text-white mb-4", children: "V\u00E9rification de votre paiement" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "Veuillez patienter pendant que nous v\u00E9rifions votre paiement..." })] })), status === 'success' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "flex justify-center mb-4", children: (0, jsx_runtime_1.jsx)(outline_1.CheckCircleIcon, { className: "h-16 w-16 text-green-500" }) }), (0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-bold text-white mb-4", children: "Paiement r\u00E9ussi" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 mb-6", children: message }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Vous allez \u00EAtre redirig\u00E9 vers votre tableau de bord..." })] })), status === 'error' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "flex justify-center mb-4", children: (0, jsx_runtime_1.jsx)(outline_1.XCircleIcon, { className: "h-16 w-16 text-red-500" }) }), (0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-bold text-white mb-4", children: "Erreur de paiement" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 mb-6", children: message }), (0, jsx_runtime_1.jsx)("button", { onClick: () => navigate('/pricing'), className: "btn-primary w-full", children: "Retour aux tarifs" })] }))] }) }));
}
