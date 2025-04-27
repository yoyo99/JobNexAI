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
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { useAuth } from '../stores/auth';
export function UserPreferences() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [preferences, setPreferences] = useState(null);
    const [message, setMessage] = useState(null);
    const jobTypes = [
        { value: 'FULL_TIME', label: t('jobSearch.types.fullTime') },
        { value: 'PART_TIME', label: t('jobSearch.types.partTime') },
        { value: 'CONTRACT', label: t('jobSearch.types.contract') },
        { value: 'FREELANCE', label: t('jobSearch.types.freelance') },
        { value: 'INTERNSHIP', label: t('jobSearch.types.internship') },
    ];
    const remotePreferences = [
        { value: 'remote', label: t('jobSearch.locations.remote') },
        { value: 'hybrid', label: t('jobSearch.locations.hybrid') },
        { value: 'onsite', label: t('jobSearch.locations.onsite') },
        { value: 'any', label: 'Indifférent' },
    ];
    useEffect(() => {
        loadPreferences();
    }, [user]);
    const loadPreferences = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            const { data, error } = yield supabase
                .from('user_preferences')
                .select('*')
                .eq('user_id', user === null || user === void 0 ? void 0 : user.id)
                .single();
            if (error)
                throw error;
            setPreferences(data || {
                job_types: [],
                preferred_locations: [],
                min_salary: null,
                max_salary: null,
                remote_preference: null,
            });
        }
        catch (error) {
            console.error('Error loading preferences:', error);
        }
        finally {
            setLoading(false);
        }
    });
    const handleSave = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setSaving(true);
            const { error } = yield supabase
                .from('user_preferences')
                .upsert(Object.assign({ user_id: user === null || user === void 0 ? void 0 : user.id }, preferences));
            if (error)
                throw error;
            setMessage({ type: 'success', text: t('profile.personalInfo.updateSuccess') });
        }
        catch (error) {
            console.error('Error saving preferences:', error);
            setMessage({ type: 'error', text: t('profile.personalInfo.updateError') });
        }
        finally {
            setSaving(false);
        }
    });
    const toggleJobType = (type) => {
        if (!preferences)
            return;
        const newTypes = preferences.job_types.includes(type)
            ? preferences.job_types.filter(t => t !== type)
            : [...preferences.job_types, type];
        setPreferences(Object.assign(Object.assign({}, preferences), { job_types: newTypes }));
    };
    const handleLocationChange = (e) => {
        if (!preferences)
            return;
        const location = e.target.value.trim();
        if (!location)
            return;
        setPreferences(Object.assign(Object.assign({}, preferences), { preferred_locations: [...new Set([...preferences.preferred_locations, location])] }));
    };
    const removeLocation = (location) => {
        if (!preferences)
            return;
        setPreferences(Object.assign(Object.assign({}, preferences), { preferred_locations: preferences.preferred_locations.filter(l => l !== location) }));
    };
    if (loading) {
        return (_jsx("div", { className: "flex justify-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium text-white mb-4", children: "Types de poste" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3", children: jobTypes.map((type) => (_jsx("button", { onClick: () => toggleJobType(type.value), className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${(preferences === null || preferences === void 0 ? void 0 : preferences.job_types.includes(type.value))
                                ? 'bg-primary-600 text-white'
                                : 'bg-white/5 text-gray-300 hover:bg-white/10'}`, children: type.label }, type.value))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium text-white mb-4", children: "Localisations" }), _jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "flex gap-2", children: _jsx("input", { type: "text", placeholder: "Ajouter une localisation...", className: "flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500", onKeyPress: (e) => {
                                        if (e.key === 'Enter') {
                                            handleLocationChange(e);
                                            e.target.value = '';
                                        }
                                    } }) }), _jsx("div", { className: "flex flex-wrap gap-2", children: preferences === null || preferences === void 0 ? void 0 : preferences.preferred_locations.map((location) => (_jsxs("span", { className: "bg-white/5 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2", children: [location, _jsx("button", { onClick: () => removeLocation(location), className: "text-gray-400 hover:text-white", children: "\u00D7" })] }, location))) })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium text-white mb-4", children: "Mode de travail" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: remotePreferences.map((pref) => (_jsx("button", { onClick: () => setPreferences(prev => prev ? Object.assign(Object.assign({}, prev), { remote_preference: pref.value }) : null), className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${(preferences === null || preferences === void 0 ? void 0 : preferences.remote_preference) === pref.value
                                ? 'bg-primary-600 text-white'
                                : 'bg-white/5 text-gray-300 hover:bg-white/10'}`, children: pref.label }, pref.value))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium text-white mb-4", children: "Fourchette de salaire" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Minimum" }), _jsx("input", { type: "number", value: (preferences === null || preferences === void 0 ? void 0 : preferences.min_salary) || '', onChange: (e) => setPreferences(prev => prev ? Object.assign(Object.assign({}, prev), { min_salary: Number(e.target.value) || null }) : null), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Maximum" }), _jsx("input", { type: "number", value: (preferences === null || preferences === void 0 ? void 0 : preferences.max_salary) || '', onChange: (e) => setPreferences(prev => prev ? Object.assign(Object.assign({}, prev), { max_salary: Number(e.target.value) || null }) : null), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] })] })] }), message && (_jsx("div", { className: `rounded-md p-4 ${message.type === 'success' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`, children: _jsx("p", { className: "text-sm", children: message.text }) })), _jsx("div", { className: "flex justify-end", children: _jsx("button", { onClick: handleSave, disabled: saving, className: "btn-primary", children: saving ? t('common.loading') : t('common.save') }) })] }));
}
