import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../stores/auth';
import { SubscriptionManager } from './SubscriptionManager';
import { BillingHistory } from './BillingHistory';
import { StripeWebhookInfo } from './StripeWebhookInfo';
export function Billing() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('subscription');
    if (!user) {
        return null;
    }
    return (_jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "mb-8", children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Facturation" }), _jsx("p", { className: "text-gray-400 mt-1", children: "G\u00E9rez votre abonnement et consultez votre historique de facturation" })] }), _jsx("div", { className: "mb-6 border-b border-white/10", children: _jsxs("nav", { className: "flex space-x-8", children: [_jsx("button", { onClick: () => setActiveTab('subscription'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'subscription'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "Abonnement" }), _jsx("button", { onClick: () => setActiveTab('history'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'history'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "Historique" }), _jsx("button", { onClick: () => setActiveTab('webhook'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'webhook'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "Webhook" })] }) }), _jsxs("div", { className: "card", children: [activeTab === 'subscription' && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, children: _jsx(SubscriptionManager, {}) })), activeTab === 'history' && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, children: _jsx(BillingHistory, {}) })), activeTab === 'webhook' && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, children: _jsx(StripeWebhookInfo, {}) }))] })] }));
}
