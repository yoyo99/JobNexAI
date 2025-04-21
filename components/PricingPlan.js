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
exports.PricingPlan = PricingPlan;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const outline_1 = require("@heroicons/react/24/outline");
const auth_1 = require("../stores/auth");
const stripe_service_1 = require("../lib/stripe-service");
const react_router_dom_1 = require("react-router-dom");
function PricingPlan({ name, price, priceId, description, features, cta, mostPopular = false, frequency, userType, }) {
    const { user } = (0, auth_1.useAuth)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const handleSubscribe = () => __awaiter(this, void 0, void 0, function* () {
        if (!user) {
            navigate('/login', { state: { from: '/pricing' } });
            return;
        }
        if (!priceId) {
            // Pour le plan gratuit
            navigate('/dashboard');
            return;
        }
        try {
            setLoading(true);
            const { success, error } = yield stripe_service_1.StripeService.createCheckoutSession(user.id, priceId, userType);
            if (!success) {
                throw new Error(error || 'Une erreur est survenue lors de la création de la session de paiement');
            }
        }
        catch (error) {
            console.error('Error subscribing:', error);
            alert(error.message || 'Une erreur est survenue');
        }
        finally {
            setLoading(false);
        }
    });
    return ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: `relative rounded-2xl border ${mostPopular
            ? 'border-primary-400 bg-primary-900/10'
            : 'border-white/10 bg-white/5'} p-8 shadow-lg`, children: [mostPopular && ((0, jsx_runtime_1.jsx)("div", { className: "absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-400 text-white px-4 py-1 rounded-full text-sm font-medium", children: "Le plus populaire" })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-white mb-2", children: name }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 mb-4", children: description }), (0, jsx_runtime_1.jsxs)("p", { className: "text-4xl font-bold text-white mb-6", children: [frequency === 'monthly'
                                ? price
                                : name === 'Free'
                                    ? '0€'
                                    : `${parseFloat(price.replace('€', '')) * 0.8 * 12}€`, (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-400", children: name !== 'Free' && `/${frequency === 'monthly' ? 'mois' : 'an'}` })] }), (0, jsx_runtime_1.jsx)("ul", { className: "space-y-4 mb-8", children: features.map((feature) => ((0, jsx_runtime_1.jsxs)("li", { className: "flex items-start gap-3 text-gray-300", children: [(0, jsx_runtime_1.jsx)(outline_1.CheckIcon, { className: "h-6 w-6 flex-none text-primary-400", "aria-hidden": "true" }), (0, jsx_runtime_1.jsx)("span", { children: feature })] }, feature))) }), (0, jsx_runtime_1.jsx)("button", { onClick: handleSubscribe, disabled: loading, className: "w-full btn-primary", children: loading ? 'Chargement...' : cta })] })] }));
}
