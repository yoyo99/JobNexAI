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
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../stores/auth';
import { motion } from 'framer-motion';
export function NotificationPreferences() {
    const { user } = useAuth();
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    useEffect(() => {
        if (user) {
            loadSettings();
        }
    }, [user]);
    const loadSettings = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            const { data, error } = yield supabase
                .from('notification_settings')
                .select('*')
                .eq('user_id', user === null || user === void 0 ? void 0 : user.id)
                .single();
            if (error)
                throw error;
            setSettings(data);
        }
        catch (error) {
            console.error('Error loading notification settings:', error);
        }
        finally {
            setLoading(false);
        }
    });
    const updateSettings = () => __awaiter(this, void 0, void 0, function* () {
        if (!settings)
            return;
        try {
            setSaving(true);
            setMessage(null);
            const { error } = yield supabase
                .from('notification_settings')
                .upsert(Object.assign(Object.assign({ user_id: user === null || user === void 0 ? void 0 : user.id }, settings), { updated_at: new Date().toISOString() }));
            if (error)
                throw error;
            setMessage({ type: 'success', text: 'Préférences mises à jour avec succès' });
        }
        catch (error) {
            console.error('Error updating notification settings:', error);
            setMessage({ type: 'error', text: 'Erreur lors de la mise à jour des préférences' });
        }
        finally {
            setSaving(false);
        }
    });
    const toggleSetting = (key) => {
        if (!settings)
            return;
        setSettings(prev => prev ? Object.assign(Object.assign({}, prev), { [key]: !prev[key] }) : null);
    };
    if (loading) {
        return (_jsx("div", { className: "flex justify-center p-4", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    if (!settings)
        return null;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-medium text-white mb-4", children: "Pr\u00E9f\u00E9rences de notification" }), _jsx("p", { className: "text-gray-400", children: "Personnalisez la fa\u00E7on dont vous souhaitez \u00EAtre notifi\u00E9 des diff\u00E9rents \u00E9v\u00E9nements." })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-white", children: "Notifications par email" }), _jsx("p", { className: "text-sm text-gray-400", children: "Recevez des notifications par email pour les mises \u00E0 jour importantes" })] }), _jsx("button", { onClick: () => toggleSetting('email_notifications'), className: `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${settings.email_notifications ? 'bg-primary-600' : 'bg-gray-700'}`, children: _jsx("span", { className: `inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.email_notifications ? 'translate-x-5' : 'translate-x-0'}` }) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-white", children: "Notifications push" }), _jsx("p", { className: "text-sm text-gray-400", children: "Recevez des notifications dans votre navigateur" })] }), _jsx("button", { onClick: () => toggleSetting('push_notifications'), className: `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${settings.push_notifications ? 'bg-primary-600' : 'bg-gray-700'}`, children: _jsx("span", { className: `inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.push_notifications ? 'translate-x-5' : 'translate-x-0'}` }) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-white", children: "Notifications dans l'application" }), _jsx("p", { className: "text-sm text-gray-400", children: "Recevez des notifications directement dans l'application" })] }), _jsx("button", { onClick: () => toggleSetting('in_app_notifications'), className: `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${settings.in_app_notifications ? 'bg-primary-600' : 'bg-gray-700'}`, children: _jsx("span", { className: `inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.in_app_notifications ? 'translate-x-5' : 'translate-x-0'}` }) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-white", children: "Alertes emploi" }), _jsx("p", { className: "text-sm text-gray-400", children: "Recevez des notifications pour les nouvelles offres correspondant \u00E0 vos crit\u00E8res" })] }), _jsx("button", { onClick: () => toggleSetting('job_alerts'), className: `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${settings.job_alerts ? 'bg-primary-600' : 'bg-gray-700'}`, children: _jsx("span", { className: `inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.job_alerts ? 'translate-x-5' : 'translate-x-0'}` }) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-white", children: "Demandes de connexion" }), _jsx("p", { className: "text-sm text-gray-400", children: "Recevez des notifications pour les nouvelles demandes de connexion" })] }), _jsx("button", { onClick: () => toggleSetting('connection_requests'), className: `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${settings.connection_requests ? 'bg-primary-600' : 'bg-gray-700'}`, children: _jsx("span", { className: `inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.connection_requests ? 'translate-x-5' : 'translate-x-0'}` }) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-white", children: "Messages" }), _jsx("p", { className: "text-sm text-gray-400", children: "Recevez des notifications pour les nouveaux messages" })] }), _jsx("button", { onClick: () => toggleSetting('messages'), className: `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${settings.messages ? 'bg-primary-600' : 'bg-gray-700'}`, children: _jsx("span", { className: `inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.messages ? 'translate-x-5' : 'translate-x-0'}` }) })] })] }), message && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: `rounded-lg p-4 ${message.type === 'success'
                    ? 'bg-green-900/50 text-green-400'
                    : 'bg-red-900/50 text-red-400'}`, children: message.text })), _jsx("div", { className: "flex justify-end", children: _jsx("button", { onClick: updateSettings, disabled: saving, className: "btn-primary", children: saving ? 'Enregistrement...' : 'Enregistrer les préférences' }) })] }));
}
