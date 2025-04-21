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
exports.StripeWebhookInfo = StripeWebhookInfo;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const outline_1 = require("@heroicons/react/24/outline");
function StripeWebhookInfo() {
    const [copied, setCopied] = (0, react_1.useState)(false);
    // URL de la fonction Edge de Supabase pour le webhook
    const webhookUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-webhook`;
    const copyToClipboard = () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield navigator.clipboard.writeText(webhookUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
        catch (err) {
            console.error('Erreur lors de la copie:', err);
        }
    });
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/5 rounded-lg p-6 space-y-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-white", children: "Configuration du webhook Stripe" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-300", children: ["Pour configurer le webhook Stripe, vous devez ajouter l'URL suivante dans votre", (0, jsx_runtime_1.jsx)("a", { href: "https://dashboard.stripe.com/webhooks", target: "_blank", rel: "noopener noreferrer", className: "text-primary-400 hover:text-primary-300 ml-1", children: "dashboard Stripe" }), ":"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 bg-white/10 p-3 rounded-lg", children: [(0, jsx_runtime_1.jsx)("code", { className: "text-sm text-white flex-1 overflow-x-auto", children: webhookUrl }), (0, jsx_runtime_1.jsx)("button", { onClick: copyToClipboard, className: "p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10", children: copied ? (0, jsx_runtime_1.jsx)(outline_1.CheckIcon, { className: "h-5 w-5 text-green-400" }) : (0, jsx_runtime_1.jsx)(outline_1.ClipboardIcon, { className: "h-5 w-5" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-gray-300", children: "\u00C9v\u00E9nements \u00E0 \u00E9couter:" }), (0, jsx_runtime_1.jsxs)("ul", { className: "list-disc list-inside text-gray-300 space-y-1", children: [(0, jsx_runtime_1.jsx)("li", { children: "checkout.session.completed" }), (0, jsx_runtime_1.jsx)("li", { children: "customer.subscription.updated" }), (0, jsx_runtime_1.jsx)("li", { children: "customer.subscription.deleted" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-4 p-4 bg-white/5 rounded-lg", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-white font-medium mb-2", children: "Cl\u00E9 secr\u00E8te Restricted Key" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 mb-4", children: "Utilisez cette cl\u00E9 d'API restreinte pour les fonctions Edge Supabase:" }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white/10 p-3 rounded-lg", children: (0, jsx_runtime_1.jsx)("code", { className: "text-sm text-white break-all", children: "rk_test_51R9nCKQIOmiow871fPTN2vLxMMSyNSorZnpqWeoV7cJKHQLKcBdr1xHJFPVzNGPmApnMB9HzDs6x4oQzArXxutNG00Ul2TpX6h" }) })] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-300", children: ["Une fois configur\u00E9, copiez le \"Signing Secret\" g\u00E9n\u00E9r\u00E9 par Stripe et ajoutez-le \u00E0 vos variables d'environnement Supabase sous le nom ", (0, jsx_runtime_1.jsx)("code", { className: "bg-white/10 px-2 py-1 rounded", children: "STRIPE_WEBHOOK_SECRET" }), "."] }), (0, jsx_runtime_1.jsx)("div", { className: "bg-yellow-900/30 text-yellow-400 p-4 rounded-lg", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-sm", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Note:" }), " Pour tester en local, vous pouvez utiliser l'outil Stripe CLI ou un service comme ngrok pour exposer votre serveur local \u00E0 internet."] }) })] }));
}
