import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '../stores/auth';
import { InvoiceHistory } from './InvoiceHistory';
import { PaymentMethodList } from './PaymentMethodList';
export function BillingHistory() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('invoices');
    if (!user) {
        return null;
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h2", { className: "text-lg font-medium text-white", children: "Historique de facturation" }), _jsx("div", { className: "mb-6 border-b border-white/10", children: _jsxs("nav", { className: "flex space-x-8", children: [_jsx("button", { onClick: () => setActiveTab('invoices'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'invoices'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "Factures" }), _jsx("button", { onClick: () => setActiveTab('payment-methods'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'payment-methods'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "M\u00E9thodes de paiement" })] }) }), activeTab === 'invoices' && (_jsx("div", { children: _jsx(InvoiceHistory, {}) })), activeTab === 'payment-methods' && (_jsx("div", { children: _jsx(PaymentMethodList, {}) }))] }));
}
