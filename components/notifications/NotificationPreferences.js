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
exports.NotificationPreferences = NotificationPreferences;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const supabase_1 = require("../../lib/supabase");
const auth_1 = require("../../stores/auth");
const framer_motion_1 = require("framer-motion");
function NotificationPreferences() {
    const { user } = (0, auth_1.useAuth)();
    const [settings, setSettings] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [saving, setSaving] = (0, react_1.useState)(false);
    const [message, setMessage] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (user) {
            loadSettings();
        }
    }, [user]);
    const loadSettings = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            const { data, error } = yield supabase_1.supabase
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
            const { error } = yield supabase_1.supabase
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
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center p-4", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    if (!settings)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-medium text-white mb-4", children: "Pr\u00E9f\u00E9rences de notification" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "Personnalisez la fa\u00E7on dont vous souhaitez \u00EAtre notifi\u00E9 des diff\u00E9rents \u00E9v\u00E9nements." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "font-medium text-white", children: "Notifications par email" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: "Recevez des notifications par email pour les mises \u00E0 jour importantes" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => toggleSetting('email_notifications'), className: `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${settings.email_notifications ? 'bg-primary-600' : 'bg-gray-700'}`, children: (0, jsx_runtime_1.jsx)("span", { className: `inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.email_notifications ? 'translate-x-5' : 'translate-x-0'}` }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "font-medium text-white", children: "Notifications push" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: "Recevez des notifications dans votre navigateur" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => toggleSetting('push_notifications'), className: `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${settings.push_notifications ? 'bg-primary-600' : 'bg-gray-700'}`, children: (0, jsx_runtime_1.jsx)("span", { className: `inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.push_notifications ? 'translate-x-5' : 'translate-x-0'}` }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "font-medium text-white", children: "Notifications dans l'application" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: "Recevez des notifications directement dans l'application" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => toggleSetting('in_app_notifications'), className: `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${settings.in_app_notifications ? 'bg-primary-600' : 'bg-gray-700'}`, children: (0, jsx_runtime_1.jsx)("span", { className: `inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.in_app_notifications ? 'translate-x-5' : 'translate-x-0'}` }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "font-medium text-white", children: "Alertes emploi" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: "Recevez des notifications pour les nouvelles offres correspondant \u00E0 vos crit\u00E8res" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => toggleSetting('job_alerts'), className: `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${settings.job_alerts ? 'bg-primary-600' : 'bg-gray-700'}`, children: (0, jsx_runtime_1.jsx)("span", { className: `inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.job_alerts ? 'translate-x-5' : 'translate-x-0'}` }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "font-medium text-white", children: "Demandes de connexion" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: "Recevez des notifications pour les nouvelles demandes de connexion" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => toggleSetting('connection_requests'), className: `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${settings.connection_requests ? 'bg-primary-600' : 'bg-gray-700'}`, children: (0, jsx_runtime_1.jsx)("span", { className: `inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.connection_requests ? 'translate-x-5' : 'translate-x-0'}` }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "font-medium text-white", children: "Messages" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-400", children: "Recevez des notifications pour les nouveaux messages" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => toggleSetting('messages'), className: `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${settings.messages ? 'bg-primary-600' : 'bg-gray-700'}`, children: (0, jsx_runtime_1.jsx)("span", { className: `inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.messages ? 'translate-x-5' : 'translate-x-0'}` }) })] })] }), message && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: `rounded-lg p-4 ${message.type === 'success'
                    ? 'bg-green-900/50 text-green-400'
                    : 'bg-red-900/50 text-red-400'}`, children: message.text })), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-end", children: (0, jsx_runtime_1.jsx)("button", { onClick: updateSettings, disabled: saving, className: "btn-primary", children: saving ? 'Enregistrement...' : 'Enregistrer les préférences' }) })] }));
}
