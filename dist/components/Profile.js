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
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../stores/auth';
import { supabase } from '../lib/supabase';
import { UserPreferences } from './UserPreferences';
import { UserSkills } from './UserSkills';
import { JobAlerts } from './JobAlerts';
import { useTranslation } from 'react-i18next';
import { SubscriptionManager } from './SubscriptionManager';
import { StripeWebhookInfo } from './StripeWebhookInfo';
import UserAISettings from './UserAISettings';
export function Profile() {
    const { user, subscription, loadUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState((user === null || user === void 0 ? void 0 : user.full_name) || '');
    const [message, setMessage] = useState(null);
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('profile');
    const handleUpdateProfile = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        try {
            setLoading(true);
            const { error } = yield supabase
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
    return (_jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "mb-8", children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: t('profile.title') }), _jsx("p", { className: "text-gray-400 mt-1", children: t('profile.subtitle') })] }), _jsx("div", { className: "mb-6 border-b border-white/10", children: _jsxs("nav", { className: "flex space-x-8", children: [_jsx("button", { onClick: () => setActiveTab('profile'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "Profile" }), _jsx("button", { onClick: () => setActiveTab('subscription'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'subscription'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "Abonnement" }), _jsx("button", { onClick: () => setActiveTab('preferences'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'preferences'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "Pr\u00E9f\u00E9rences" }), _jsx("button", { onClick: () => setActiveTab('ai'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'ai'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "IA" }), _jsx("button", { onClick: () => setActiveTab('skills'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'skills'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "Comp\u00E9tences" }), _jsx("button", { onClick: () => setActiveTab('alerts'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'alerts'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "Alertes" }), _jsx("button", { onClick: () => setActiveTab('webhook'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'webhook'
                                ? 'border-primary-400 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`, children: "Webhook" })] }) }), activeTab === 'profile' && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card", children: [_jsx("h2", { className: "text-lg font-semibold text-white mb-6", children: t('profile.personalInfo.title') }), _jsxs("form", { onSubmit: handleUpdateProfile, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-400 mb-1", children: t('auth.email') }), _jsx("input", { type: "email", id: "email", value: user === null || user === void 0 ? void 0 : user.email, disabled: true, className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white opacity-50" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "fullName", className: "block text-sm font-medium text-gray-400 mb-1", children: t('profile.personalInfo.fullName') }), _jsx("input", { type: "text", id: "fullName", value: fullName, onChange: (e) => setFullName(e.target.value), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), message && (_jsx("div", { className: `rounded-md p-4 ${message.type === 'success' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`, children: _jsx("p", { className: "text-sm", children: message.text }) })), _jsx("button", { type: "submit", disabled: loading, className: "btn-primary w-full", children: loading ? t('common.loading') : t('common.save') })] })] })), activeTab === 'subscription' && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card", children: _jsx(SubscriptionManager, {}) })), activeTab === 'preferences' && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card", children: _jsx(UserPreferences, {}) })), activeTab === 'ai' && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card", children: [_jsx("h2", { className: "text-lg font-semibold text-white mb-6", children: "Param\u00E8tres IA" }), _jsx(UserAISettings, { userId: user === null || user === void 0 ? void 0 : user.id })] })), activeTab === 'skills' && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card", children: _jsx(UserSkills, {}) })), activeTab === 'alerts' && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card", children: _jsx(JobAlerts, {}) })), activeTab === 'webhook' && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card", children: _jsx(StripeWebhookInfo, {}) }))] }));
}
