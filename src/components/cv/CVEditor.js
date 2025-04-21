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
import { useAuth } from '../../stores/auth';
import { supabase } from '../../lib/supabase';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { HeaderSection } from './sections/HeaderSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { EducationSection } from './sections/EducationSection';
import { SkillsSection } from './sections/SkillsSection';
import { ProjectsSection } from './sections/ProjectsSection';
export function CVEditor({ templateId, onBack }) {
    const { user } = useAuth();
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    useEffect(() => {
        loadCV();
    }, [templateId]);
    const loadCV = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            const { data: template, error: templateError } = yield supabase
                .from('cv_templates')
                .select('structure')
                .eq('id', templateId)
                .single();
            if (templateError)
                throw templateError;
            const { data: cv, error: cvError } = yield supabase
                .from('user_cvs')
                .select('sections')
                .eq('user_id', user === null || user === void 0 ? void 0 : user.id)
                .eq('template_id', templateId)
                .single();
            if (!cvError) {
                setSections(cv.sections);
            }
            else {
                setSections(template.structure.sections);
            }
        }
        catch (error) {
            console.error('Error loading CV:', error);
        }
        finally {
            setLoading(false);
        }
    });
    const saveCV = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setSaving(true);
            setMessage(null);
            const { error } = yield supabase
                .from('user_cvs')
                .upsert({
                user_id: user === null || user === void 0 ? void 0 : user.id,
                template_id: templateId,
                sections,
            });
            if (error)
                throw error;
            setMessage({ type: 'success', text: 'CV enregistré avec succès' });
        }
        catch (error) {
            console.error('Error saving CV:', error);
            setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement du CV' });
        }
        finally {
            setSaving(false);
        }
    });
    const updateSection = (index, content) => {
        setSections(prev => prev.map((section, i) => i === index ? Object.assign(Object.assign({}, section), { content }) : section));
    };
    const renderSectionEditor = (section, index) => {
        switch (section.type) {
            case 'header':
                return (_jsx(HeaderSection, { content: section.content, onChange: (content) => updateSection(index, content) }));
            case 'experience':
                return (_jsx(ExperienceSection, { content: section.content, onChange: (content) => updateSection(index, content) }));
            case 'education':
                return (_jsx(EducationSection, { content: section.content, onChange: (content) => updateSection(index, content) }));
            case 'skills':
                return (_jsx(SkillsSection, { content: section.content, onChange: (content) => updateSection(index, content) }));
            case 'projects':
                return (_jsx(ProjectsSection, { content: section.content, onChange: (content) => updateSection(index, content) }));
            default:
                return (_jsx("div", { className: "text-gray-400", children: "\u00C9diteur non disponible pour cette section" }));
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex justify-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    return (_jsxs("div", { className: "w-1/2 bg-background border-r border-white/10 p-6 overflow-y-auto", children: [_jsxs("div", { className: "flex items-center gap-4 mb-6", children: [_jsx("button", { onClick: onBack, className: "p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5", children: _jsx(ArrowLeftIcon, { className: "h-5 w-5" }) }), _jsx("h2", { className: "text-lg font-medium text-white", children: "\u00C9diter votre CV" })] }), _jsx("div", { className: "space-y-6", children: sections.map((section, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.1 }, className: "card", children: [_jsx("h3", { className: "text-white font-medium mb-4", children: section.title }), renderSectionEditor(section, index)] }, index))) }), message && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: `mt-6 rounded-lg p-4 ${message.type === 'success'
                    ? 'bg-green-900/50 text-green-400'
                    : 'bg-red-900/50 text-red-400'}`, children: message.text })), _jsx("div", { className: "mt-6 flex justify-end", children: _jsx("button", { onClick: saveCV, disabled: saving, className: "btn-primary", children: saving ? 'Enregistrement...' : 'Enregistrer' }) })] }));
}
