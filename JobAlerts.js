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
exports.JobAlerts = JobAlerts;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const outline_1 = require("@heroicons/react/24/outline");
const supabase_1 = require("../lib/supabase");
const auth_1 = require("../stores/auth");
function JobAlerts() {
    const { user } = (0, auth_1.useAuth)();
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [alerts, setAlerts] = (0, react_1.useState)([]);
    const [showForm, setShowForm] = (0, react_1.useState)(false);
    const [newAlert, setNewAlert] = (0, react_1.useState)({
        keywords: [],
        locations: [],
        job_types: [],
        frequency: 'daily',
        is_active: true
    });
    (0, react_1.useEffect)(() => {
        if (user) {
            loadAlerts();
        }
    }, [user]);
    const loadAlerts = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            const { data, error } = yield supabase_1.supabase
                .from('job_alerts')
                .select('*')
                .eq('user_id', user === null || user === void 0 ? void 0 : user.id)
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            setAlerts(data || []);
        }
        catch (error) {
            console.error('Error loading alerts:', error);
        }
        finally {
            setLoading(false);
        }
    });
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        try {
            const { error } = yield supabase_1.supabase
                .from('job_alerts')
                .insert(Object.assign({ user_id: user === null || user === void 0 ? void 0 : user.id }, newAlert));
            if (error)
                throw error;
            setShowForm(false);
            setNewAlert({
                keywords: [],
                locations: [],
                job_types: [],
                frequency: 'daily',
                is_active: true
            });
            loadAlerts();
        }
        catch (error) {
            console.error('Error creating alert:', error);
        }
    });
    const toggleAlert = (id, isActive) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { error } = yield supabase_1.supabase
                .from('job_alerts')
                .update({ is_active: !isActive })
                .eq('id', id);
            if (error)
                throw error;
            loadAlerts();
        }
        catch (error) {
            console.error('Error updating alert:', error);
        }
    });
    const deleteAlert = (id) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { error } = yield supabase_1.supabase
                .from('job_alerts')
                .delete()
                .eq('id', id);
            if (error)
                throw error;
            loadAlerts();
        }
        catch (error) {
            console.error('Error deleting alert:', error);
        }
    });
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center py-12", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-medium text-white", children: "Alertes emploi" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setShowForm(true), className: "btn-primary", children: "Cr\u00E9er une alerte" })] }), showForm && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.form, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card", onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Mots-cl\u00E9s" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "D\u00E9veloppeur, React, JavaScript...", className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", onChange: (e) => setNewAlert(Object.assign(Object.assign({}, newAlert), { keywords: e.target.value.split(',').map(k => k.trim()) })) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Localisations" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Paris, Lyon, Remote...", className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", onChange: (e) => setNewAlert(Object.assign(Object.assign({}, newAlert), { locations: e.target.value.split(',').map(l => l.trim()) })) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Types de contrat" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-2", children: ['CDI', 'CDD', 'Freelance', 'Stage', 'Alternance'].map((type) => ((0, jsx_runtime_1.jsxs)("label", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", className: "rounded border-white/10 bg-white/5 text-primary-500 focus:ring-primary-500", onChange: (e) => {
                                                        const types = newAlert.job_types || [];
                                                        setNewAlert(Object.assign(Object.assign({}, newAlert), { job_types: e.target.checked
                                                                ? [...types, type]
                                                                : types.filter(t => t !== type) }));
                                                    } }), (0, jsx_runtime_1.jsx)("span", { className: "text-white text-sm", children: type })] }, type))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Fr\u00E9quence" }), (0, jsx_runtime_1.jsxs)("select", { className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", value: newAlert.frequency, onChange: (e) => setNewAlert(Object.assign(Object.assign({}, newAlert), { frequency: e.target.value })), children: [(0, jsx_runtime_1.jsx)("option", { value: "daily", children: "Quotidienne" }), (0, jsx_runtime_1.jsx)("option", { value: "weekly", children: "Hebdomadaire" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-6 flex justify-end space-x-3", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setShowForm(false), className: "btn-secondary", children: "Annuler" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "btn-primary", children: "Cr\u00E9er l'alerte" })] })] })), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: alerts.map((alert) => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(outline_1.BellIcon, { className: "h-5 w-5 text-primary-400" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-white font-medium", children: alert.keywords.join(', ') })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-2 space-y-1 text-sm text-gray-400", children: [(0, jsx_runtime_1.jsxs)("p", { children: ["Localisations : ", alert.locations.join(', ')] }), (0, jsx_runtime_1.jsxs)("p", { children: ["Types de contrat : ", alert.job_types.join(', ')] }), (0, jsx_runtime_1.jsxs)("p", { children: ["Fr\u00E9quence : ", alert.frequency === 'daily' ? 'Quotidienne' : 'Hebdomadaire'] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => toggleAlert(alert.id, alert.is_active), className: `text-sm font-medium px-3 py-1 rounded-full ${alert.is_active
                                            ? 'bg-green-900/50 text-green-400'
                                            : 'bg-gray-900/50 text-gray-400'}`, children: alert.is_active ? 'Activée' : 'Désactivée' }), (0, jsx_runtime_1.jsx)("button", { onClick: () => deleteAlert(alert.id), className: "text-gray-400 hover:text-white", children: (0, jsx_runtime_1.jsx)(outline_1.XMarkIcon, { className: "h-5 w-5" }) })] })] }) }, alert.id))) })] }));
}
