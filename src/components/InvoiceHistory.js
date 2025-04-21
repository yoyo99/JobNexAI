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
import { useAuth } from '../stores/auth';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
export function InvoiceHistory() {
    const { user } = useAuth();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (user) {
            loadInvoices();
        }
    }, [user]);
    const loadInvoices = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            setError(null);
            const { data, error } = yield supabase.functions.invoke('list-invoices', {
                body: { userId: user === null || user === void 0 ? void 0 : user.id }
            });
            if (error)
                throw error;
            setInvoices(data || []);
        }
        catch (error) {
            console.error('Error loading invoices:', error);
            setError(error.message || 'Une erreur est survenue');
        }
        finally {
            setLoading(false);
        }
    });
    const formatCurrency = (amount, currency) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: currency.toUpperCase(),
        }).format(amount / 100);
    };
    if (loading) {
        return (_jsx("div", { className: "flex justify-center py-6", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h3", { className: "text-lg font-medium text-white", children: "Historique des factures" }), error && (_jsx("div", { className: "bg-red-900/50 text-red-400 p-4 rounded-lg", children: error })), invoices.length === 0 ? (_jsx("div", { className: "bg-white/5 rounded-lg p-6 text-center", children: _jsx("p", { className: "text-gray-400", children: "Aucune facture disponible" }) })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-white/10", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider", children: "Num\u00E9ro" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider", children: "Date" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider", children: "Montant" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider", children: "Statut" }), _jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-white/10", children: invoices.map((invoice) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-white", children: invoice.number }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-white", children: format(new Date(invoice.created * 1000), 'dd MMMM yyyy', { locale: fr }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-white", children: formatCurrency(invoice.amount_paid, invoice.currency) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm", children: _jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${invoice.status === 'paid' ? 'bg-green-900/50 text-green-400' :
                                                invoice.status === 'open' ? 'bg-yellow-900/50 text-yellow-400' :
                                                    'bg-red-900/50 text-red-400'}`, children: invoice.status === 'paid' ? 'Payée' :
                                                invoice.status === 'open' ? 'En attente' :
                                                    'Non payée' }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-right", children: _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx("a", { href: invoice.hosted_invoice_url, target: "_blank", rel: "noopener noreferrer", className: "text-primary-400 hover:text-primary-300", children: "Voir" }), _jsxs("a", { href: invoice.pdf, target: "_blank", rel: "noopener noreferrer", className: "text-primary-400 hover:text-primary-300 flex items-center gap-1", children: [_jsx(DocumentArrowDownIcon, { className: "h-4 w-4" }), "PDF"] })] }) })] }, invoice.id))) })] }) }))] }));
}
