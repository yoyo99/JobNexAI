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
exports.Profile = Profile;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const auth_1 = require("../stores/auth");
const supabase_1 = require("../lib/supabase");
const UserPreferences_1 = require("./UserPreferences");
const UserSkills_1 = require("./UserSkills");
const JobAlerts_1 = require("./JobAlerts");
const react_i18next_1 = require("react-i18next");
const SubscriptionManager_1 = require("./SubscriptionManager");
const StripeWebhookInfo_1 = require("./StripeWebhookInfo");
function Profile() {
    const { user, subscription, loadUser } = (0, auth_1.useAuth)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [fullName, setFullName] = (0, react_1.useState)((user === null || user === void 0 ? void 0 : user.full_name) || '');
    const [message, setMessage] = (0, react_1.useState)(null);
    const { t } = (0, react_i18next_1.useTranslation)();
    const [activeTab, setActiveTab] = (0, react_1.useState)('profile');
    const handleUpdateProfile = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        try {
            setLoading(true);
            const { error } = yield supabase_1.supabase
                .from('profiles')
                .update({ full_name: fullName })
                .eq('id', user === null || user === void 0 ? void 0 : user.id);
            if (error)
                throw error;
            yield loadUser();
            setMessage({ type: 'success', text: t('profile.personalInfo.updateSuccess') });
        }
        catch (error) {
            setMessage({ type: 'error', text: t('profile.personalInfo.updateError') });
        }
        finally {
            setLoading(false);
        }
    });
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-4xl mx-auto", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "mb-8", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-white", children: t('profile.title') }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 mt-1", children: t('profile.subtitle') })] }), (0, jsx_runtime_1.jsx)("div", { className: "mb-6 border-b border-white/10", children: (0, jsx_runtime_1.jsxs)("nav", { className: "flex space-x-8", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('profile'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "Profile" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('subscription'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'subscription'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "Abonnement" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('preferences'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'preferences'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "Pr\u00E9f\u00E9rences" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('skills'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'skills'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "Comp\u00E9tences" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('alerts'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'alerts'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "Alertes" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('webhook'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'webhook'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "Webhook" })] }) }), activeTab === 'profile' && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-white mb-6", children: t('profile.personalInfo.title') }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleUpdateProfile, className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-400 mb-1", children: t('auth.email') }), (0, jsx_runtime_1.jsx)("input", { type: "email", id: "email", value: user === null || user === void 0 ? void 0 : user.email, disabled: true, className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white opacity-50" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "fullName", className: "block text-sm font-medium text-gray-400 mb-1", children: t('profile.personalInfo.fullName') }), (0, jsx_runtime_1.jsx)("input", { type: "text", id: "fullName", value: fullName, onChange: (e) => setFullName(e.target.value), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), message && ((0, jsx_runtime_1.jsx)("div", { className: `rounded-md p-4 ${message.type === 'success' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`, children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm", children: message.text }) })), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: loading, className: "btn-primary w-full", children: loading ? t('common.loading') : t('common.save') })] })] })), activeTab === 'subscription' && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card", children: (0, jsx_runtime_1.jsx)(SubscriptionManager_1.SubscriptionManager, {}) })), activeTab === 'preferences' && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card", children: (0, jsx_runtime_1.jsx)(UserPreferences_1.UserPreferences, {}) })), activeTab === 'skills' && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card", children: (0, jsx_runtime_1.jsx)(UserSkills_1.UserSkills, {}) })), activeTab === 'alerts' && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card", children: (0, jsx_runtime_1.jsx)(JobAlerts_1.JobAlerts, {}) })), activeTab === 'webhook' && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card", children: (0, jsx_runtime_1.jsx)(StripeWebhookInfo_1.StripeWebhookInfo, {}) }))] }));
}
