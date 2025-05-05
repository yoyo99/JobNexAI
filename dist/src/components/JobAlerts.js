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
import { motion } from 'framer-motion';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';
import { useAuth } from '../stores/auth';
export function JobAlerts() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newAlert, setNewAlert] = useState({
        keywords: [],
        locations: [],
        job_types: [],
        frequency: 'daily',
        is_active: true
    });
    useEffect(() => {
        if (user) {
            loadAlerts();
        }
    }, [user]);
    const loadAlerts = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            const { data, error } = yield supabase
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
            const { error } = yield supabase
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
            const { error } = yield supabase
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
            const { error } = yield supabase
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
        return (_jsx("div", { className: "flex justify-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-lg font-medium text-white", children: "Alertes emploi" }), _jsx("button", { onClick: () => setShowForm(true), className: "btn-primary", children: "Cr\u00E9er une alerte" })] }), showForm && (_jsxs(motion.form, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card", onSubmit: handleSubmit, children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Mots-cl\u00E9s" }), _jsx("input", { type: "text", placeholder: "D\u00E9veloppeur, React, JavaScript...", className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", onChange: (e) => setNewAlert(Object.assign(Object.assign({}, newAlert), { keywords: e.target.value.split(',').map(k => k.trim()) })) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Localisations" }), _jsx("input", { type: "text", placeholder: "Paris, Lyon, Remote...", className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", onChange: (e) => setNewAlert(Object.assign(Object.assign({}, newAlert), { locations: e.target.value.split(',').map(l => l.trim()) })) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Types de contrat" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-2", children: ['CDI', 'CDD', 'Freelance', 'Stage', 'Alternance'].map((type) => (_jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", className: "rounded border-white/10 bg-white/5 text-primary-500 focus:ring-primary-500", onChange: (e) => {
                                                        const types = newAlert.job_types || [];
                                                        setNewAlert(Object.assign(Object.assign({}, newAlert), { job_types: e.target.checked
                                                                ? [...types, type]
                                                                : types.filter(t => t !== type) }));
                                                    } }), _jsx("span", { className: "text-white text-sm", children: type })] }, type))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Fr\u00E9quence" }), _jsxs("select", { className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", value: newAlert.frequency, onChange: (e) => setNewAlert(Object.assign(Object.assign({}, newAlert), { frequency: e.target.value })), children: [_jsx("option", { value: "daily", children: "Quotidienne" }), _jsx("option", { value: "weekly", children: "Hebdomadaire" })] })] })] }), _jsxs("div", { className: "mt-6 flex justify-end space-x-3", children: [_jsx("button", { type: "button", onClick: () => setShowForm(false), className: "btn-secondary", children: "Annuler" }), _jsx("button", { type: "submit", className: "btn-primary", children: "Cr\u00E9er l'alerte" })] })] })), _jsx("div", { className: "space-y-4", children: alerts.map((alert) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(BellIcon, { className: "h-5 w-5 text-primary-400" }), _jsx("h3", { className: "text-white font-medium", children: alert.keywords.join(', ') })] }), _jsxs("div", { className: "mt-2 space-y-1 text-sm text-gray-400", children: [_jsxs("p", { children: ["Localisations : ", alert.locations.join(', ')] }), _jsxs("p", { children: ["Types de contrat : ", alert.job_types.join(', ')] }), _jsxs("p", { children: ["Fr\u00E9quence : ", alert.frequency === 'daily' ? 'Quotidienne' : 'Hebdomadaire'] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => toggleAlert(alert.id, alert.is_active), className: `text-sm font-medium px-3 py-1 rounded-full ${alert.is_active
                                            ? 'bg-green-900/50 text-green-400'
                                            : 'bg-gray-900/50 text-gray-400'}`, children: alert.is_active ? 'Activée' : 'Désactivée' }), _jsx("button", { onClick: () => deleteAlert(alert.id), className: "text-gray-400 hover:text-white", children: _jsx(XMarkIcon, { className: "h-5 w-5" }) })] })] }) }, alert.id))) })] }));
}
