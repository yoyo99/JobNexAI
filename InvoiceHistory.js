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
exports.InvoiceHistory = InvoiceHistory;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const auth_1 = require("../stores/auth");
const supabase_1 = require("../lib/supabase");
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
const outline_1 = require("@heroicons/react/24/outline");
function InvoiceHistory() {
    const { user } = (0, auth_1.useAuth)();
    const [invoices, setInvoices] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (user) {
            loadInvoices();
        }
    }, [user]);
    const loadInvoices = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            setError(null);
            const { data, error } = yield supabase_1.supabase.functions.invoke('list-invoices', {
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
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center py-6", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-white", children: "Historique des factures" }), error && ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-900/50 text-red-400 p-4 rounded-lg", children: error })), invoices.length === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "bg-white/5 rounded-lg p-6 text-center", children: (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "Aucune facture disponible" }) })) : ((0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "min-w-full divide-y divide-white/10", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider", children: "Num\u00E9ro" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider", children: "Date" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider", children: "Montant" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider", children: "Statut" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider", children: "Actions" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "divide-y divide-white/10", children: invoices.map((invoice) => ((0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-white", children: invoice.number }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-white", children: (0, date_fns_1.format)(new Date(invoice.created * 1000), 'dd MMMM yyyy', { locale: locale_1.fr }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-white", children: formatCurrency(invoice.amount_paid, invoice.currency) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm", children: (0, jsx_runtime_1.jsx)("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${invoice.status === 'paid' ? 'bg-green-900/50 text-green-400' :
                                                invoice.status === 'open' ? 'bg-yellow-900/50 text-yellow-400' :
                                                    'bg-red-900/50 text-red-400'}`, children: invoice.status === 'paid' ? 'Payée' :
                                                invoice.status === 'open' ? 'En attente' :
                                                    'Non payée' }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-right", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end gap-2", children: [(0, jsx_runtime_1.jsx)("a", { href: invoice.hosted_invoice_url, target: "_blank", rel: "noopener noreferrer", className: "text-primary-400 hover:text-primary-300", children: "Voir" }), (0, jsx_runtime_1.jsxs)("a", { href: invoice.pdf, target: "_blank", rel: "noopener noreferrer", className: "text-primary-400 hover:text-primary-300 flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(outline_1.DocumentArrowDownIcon, { className: "h-4 w-4" }), "PDF"] })] }) })] }, invoice.id))) })] }) }))] }));
}
