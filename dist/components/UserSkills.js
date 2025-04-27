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
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { useAuth } from '../stores/auth';
export function UserSkills() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [skills, setSkills] = useState([]);
    const [userSkills, setUserSkills] = useState([]);
    const [selectedSkill, setSelectedSkill] = useState('');
    const [proficiencyLevel, setProficiencyLevel] = useState(3);
    const [yearsExperience, setYearsExperience] = useState(0);
    const [message, setMessage] = useState(null);
    useEffect(() => {
        loadSkills();
        loadUserSkills();
    }, [user]);
    const loadSkills = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield supabase
                .from('skills')
                .select('*')
                .order('name');
            if (error)
                throw error;
            setSkills(data || []);
        }
        catch (error) {
            console.error('Error loading skills:', error);
        }
    });
    const loadUserSkills = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            const { data, error } = yield supabase
                .from('user_skills')
                .select('*, skill:skills(*)')
                .eq('user_id', user === null || user === void 0 ? void 0 : user.id);
            if (error)
                throw error;
            setUserSkills(data || []);
        }
        catch (error) {
            console.error('Error loading user skills:', error);
        }
        finally {
            setLoading(false);
        }
    });
    const handleAddSkill = () => __awaiter(this, void 0, void 0, function* () {
        if (!selectedSkill)
            return;
        try {
            setSaving(true);
            const { error } = yield supabase
                .from('user_skills')
                .upsert({
                user_id: user === null || user === void 0 ? void 0 : user.id,
                skill_id: selectedSkill,
                proficiency_level: proficiencyLevel,
                years_experience: yearsExperience,
            });
            if (error)
                throw error;
            setMessage({ type: 'success', text: t('profile.personalInfo.updateSuccess') });
            loadUserSkills();
            setSelectedSkill('');
            setProficiencyLevel(3);
            setYearsExperience(0);
        }
        catch (error) {
            console.error('Error adding skill:', error);
            setMessage({ type: 'error', text: t('profile.personalInfo.updateError') });
        }
        finally {
            setSaving(false);
        }
    });
    const handleRemoveSkill = (skillId) => __awaiter(this, void 0, void 0, function* () {
        try {
            setSaving(true);
            const { error } = yield supabase
                .from('user_skills')
                .delete()
                .eq('user_id', user === null || user === void 0 ? void 0 : user.id)
                .eq('skill_id', skillId);
            if (error)
                throw error;
            setMessage({ type: 'success', text: t('profile.personalInfo.updateSuccess') });
            loadUserSkills();
        }
        catch (error) {
            console.error('Error removing skill:', error);
            setMessage({ type: 'error', text: t('profile.personalInfo.updateError') });
        }
        finally {
            setSaving(false);
        }
    });
    if (loading) {
        return (_jsx("div", { className: "flex justify-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium text-white mb-4", children: "Ajouter une comp\u00E9tence" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsx("div", { className: "md:col-span-2", children: _jsxs("select", { value: selectedSkill, onChange: (e) => setSelectedSkill(e.target.value), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", children: [_jsx("option", { value: "", children: "S\u00E9lectionner une comp\u00E9tence" }), skills.map((skill) => (_jsx("option", { value: skill.id, children: skill.name }, skill.id)))] }) }), _jsx("div", { children: _jsxs("select", { value: proficiencyLevel, onChange: (e) => setProficiencyLevel(Number(e.target.value)), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", children: [_jsx("option", { value: "1", children: "D\u00E9butant" }), _jsx("option", { value: "2", children: "\u00C9l\u00E9mentaire" }), _jsx("option", { value: "3", children: "Interm\u00E9diaire" }), _jsx("option", { value: "4", children: "Avanc\u00E9" }), _jsx("option", { value: "5", children: "Expert" })] }) }), _jsx("div", { children: _jsx("input", { type: "number", value: yearsExperience, onChange: (e) => setYearsExperience(Number(e.target.value)), placeholder: "Ann\u00E9es d'exp\u00E9rience", className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" }) })] }), _jsx("div", { className: "mt-4", children: _jsx("button", { onClick: handleAddSkill, disabled: !selectedSkill || saving, className: "btn-primary", children: saving ? t('common.loading') : 'Ajouter la compétence' }) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium text-white mb-4", children: "Vos comp\u00E9tences" }), _jsx("div", { className: "space-y-4", children: userSkills.map((userSkill) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white/5 rounded-lg p-4 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-white font-medium", children: userSkill.skill.name }), _jsxs("p", { className: "text-sm text-gray-400", children: [userSkill.skill.category, " \u2022 ", userSkill.years_experience, " ans"] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex items-center gap-1", children: [1, 2, 3, 4, 5].map((level) => (_jsx("div", { className: `w-2 h-2 rounded-full ${level <= userSkill.proficiency_level
                                                    ? 'bg-primary-400'
                                                    : 'bg-gray-600'}` }, level))) }), _jsx("button", { onClick: () => handleRemoveSkill(userSkill.skill_id), className: "text-gray-400 hover:text-white", children: "\u00D7" })] })] }, userSkill.id))) })] }), message && (_jsx("div", { className: `rounded-md p-4 ${message.type === 'success' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`, children: _jsx("p", { className: "text-sm", children: message.text }) }))] }));
}
