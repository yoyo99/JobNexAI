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
exports.CVEditor = CVEditor;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const auth_1 = require("../../stores/auth");
const supabase_1 = require("../../lib/supabase");
const outline_1 = require("@heroicons/react/24/outline");
const HeaderSection_1 = require("./sections/HeaderSection");
const ExperienceSection_1 = require("./sections/ExperienceSection");
const EducationSection_1 = require("./sections/EducationSection");
const SkillsSection_1 = require("./sections/SkillsSection");
const ProjectsSection_1 = require("./sections/ProjectsSection");
function CVEditor({ templateId, onBack }) {
    const { user } = (0, auth_1.useAuth)();
    const [sections, setSections] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [saving, setSaving] = (0, react_1.useState)(false);
    const [message, setMessage] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        loadCV();
    }, [templateId]);
    const loadCV = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            const { data: template, error: templateError } = yield supabase_1.supabase
                .from('cv_templates')
                .select('structure')
                .eq('id', templateId)
                .single();
            if (templateError)
                throw templateError;
            const { data: cv, error: cvError } = yield supabase_1.supabase
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
            const { error } = yield supabase_1.supabase
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
                return ((0, jsx_runtime_1.jsx)(HeaderSection_1.HeaderSection, { content: section.content, onChange: (content) => updateSection(index, content) }));
            case 'experience':
                return ((0, jsx_runtime_1.jsx)(ExperienceSection_1.ExperienceSection, { content: section.content, onChange: (content) => updateSection(index, content) }));
            case 'education':
                return ((0, jsx_runtime_1.jsx)(EducationSection_1.EducationSection, { content: section.content, onChange: (content) => updateSection(index, content) }));
            case 'skills':
                return ((0, jsx_runtime_1.jsx)(SkillsSection_1.SkillsSection, { content: section.content, onChange: (content) => updateSection(index, content) }));
            case 'projects':
                return ((0, jsx_runtime_1.jsx)(ProjectsSection_1.ProjectsSection, { content: section.content, onChange: (content) => updateSection(index, content) }));
            default:
                return ((0, jsx_runtime_1.jsx)("div", { className: "text-gray-400", children: "\u00C9diteur non disponible pour cette section" }));
        }
    };
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center py-12", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-1/2 bg-background border-r border-white/10 p-6 overflow-y-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 mb-6", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onBack, className: "p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5", children: (0, jsx_runtime_1.jsx)(outline_1.ArrowLeftIcon, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-medium text-white", children: "\u00C9diter votre CV" })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-6", children: sections.map((section, index) => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.1 }, className: "card", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white font-medium mb-4", children: section.title }), renderSectionEditor(section, index)] }, index))) }), message && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: `mt-6 rounded-lg p-4 ${message.type === 'success'
                    ? 'bg-green-900/50 text-green-400'
                    : 'bg-red-900/50 text-red-400'}`, children: message.text })), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 flex justify-end", children: (0, jsx_runtime_1.jsx)("button", { onClick: saveCV, disabled: saving, className: "btn-primary", children: saving ? 'Enregistrement...' : 'Enregistrer' }) })] }));
}
