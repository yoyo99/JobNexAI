"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingHistory = BillingHistory;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const auth_1 = require("../stores/auth");
const InvoiceHistory_1 = require("./InvoiceHistory");
const PaymentMethodList_1 = require("./PaymentMethodList");
function BillingHistory() {
    const { user, subscription } = (0, auth_1.useAuth)();
    const [activeTab, setActiveTab] = (0, react_1.useState)('invoices');
    if (!user) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-medium text-white", children: "Historique de facturation" }), (0, jsx_runtime_1.jsx)("div", { className: "mb-6 border-b border-white/10", children: (0, jsx_runtime_1.jsxs)("nav", { className: "flex space-x-8", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('invoices'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'invoices'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "Factures" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('payment-methods'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'payment-methods'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "M\u00E9thodes de paiement" })] }) }), activeTab === 'invoices' && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, children: (0, jsx_runtime_1.jsx)(InvoiceHistory_1.InvoiceHistory, {}) })), activeTab === 'payment-methods' && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, children: (0, jsx_runtime_1.jsx)(PaymentMethodList_1.PaymentMethodList, {}) }))] }));
}
