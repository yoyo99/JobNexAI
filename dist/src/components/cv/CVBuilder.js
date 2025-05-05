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
import { CVTemplate } from './CVTemplate';
import { CVEditor } from './CVEditor';
import { CVPreview } from './CVPreview';
function CVBuilder() {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadTemplates();
    }, []);
    const loadTemplates = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            const { data, error } = yield supabase
                .from('cv_templates')
                .select('*')
                .order('name');
            if (error)
                throw error;
            setTemplates(data || []);
        }
        catch (error) {
            console.error('Error loading templates:', error);
        }
        finally {
            setLoading(false);
        }
    });
    if (loading) {
        return (_jsx("div", { className: "flex justify-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    if (!selectedTemplate) {
        return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Cr\u00E9er votre CV" }), _jsx("p", { className: "text-gray-400 mt-1", children: "Choisissez un mod\u00E8le pour commencer" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: templates.map((template) => (_jsx(CVTemplate, { template: template, onSelect: () => setSelectedTemplate(template.id) }, template.id))) })] }));
    }
    return (_jsxs("div", { className: "flex h-screen", children: [_jsx(CVEditor, { templateId: selectedTemplate, onBack: () => setSelectedTemplate(null) }), _jsx(CVPreview, { templateId: selectedTemplate })] }));
}
export default CVBuilder;
