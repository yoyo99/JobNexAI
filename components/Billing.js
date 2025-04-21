"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Billing = Billing;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const auth_1 = require("../stores/auth");
const SubscriptionManager_1 = require("./SubscriptionManager");
const BillingHistory_1 = require("./BillingHistory");
const StripeWebhookInfo_1 = require("./StripeWebhookInfo");
function Billing() {
    const { user } = (0, auth_1.useAuth)();
    const [activeTab, setActiveTab] = (0, react_1.useState)('subscription');
    if (!user) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-4xl mx-auto", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "mb-8", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-white", children: "Facturation" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 mt-1", children: "G\u00E9rez votre abonnement et consultez votre historique de facturation" })] }), (0, jsx_runtime_1.jsx)("div", { className: "mb-6 border-b border-white/10", children: (0, jsx_runtime_1.jsxs)("nav", { className: "flex space-x-8", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('subscription'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'subscription'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "Abonnement" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('history'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'history'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "Historique" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('webhook'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'webhook'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "Webhook" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "card", children: [activeTab === 'subscription' && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, children: (0, jsx_runtime_1.jsx)(SubscriptionManager_1.SubscriptionManager, {}) })), activeTab === 'history' && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, children: (0, jsx_runtime_1.jsx)(BillingHistory_1.BillingHistory, {}) })), activeTab === 'webhook' && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, children: (0, jsx_runtime_1.jsx)(StripeWebhookInfo_1.StripeWebhookInfo, {}) }))] })] }));
}
