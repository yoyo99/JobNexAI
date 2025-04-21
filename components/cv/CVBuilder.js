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
exports.CVBuilder = CVBuilder;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const auth_1 = require("../../stores/auth");
const supabase_1 = require("../../lib/supabase");
const CVTemplate_1 = require("./CVTemplate");
const CVEditor_1 = require("./CVEditor");
const CVPreview_1 = require("./CVPreview");
function CVBuilder() {
    const { user } = (0, auth_1.useAuth)();
    const [templates, setTemplates] = (0, react_1.useState)([]);
    const [selectedTemplate, setSelectedTemplate] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        loadTemplates();
    }, []);
    const loadTemplates = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            const { data, error } = yield supabase_1.supabase
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
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center py-12", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400" }) }));
    }
    if (!selectedTemplate) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-8", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-white", children: "Cr\u00E9er votre CV" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 mt-1", children: "Choisissez un mod\u00E8le pour commencer" })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: templates.map((template) => ((0, jsx_runtime_1.jsx)(CVTemplate_1.CVTemplate, { template: template, onSelect: () => setSelectedTemplate(template.id) }, template.id))) })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex h-screen", children: [(0, jsx_runtime_1.jsx)(CVEditor_1.CVEditor, { templateId: selectedTemplate, onBack: () => setSelectedTemplate(null) }), (0, jsx_runtime_1.jsx)(CVPreview_1.CVPreview, { templateId: selectedTemplate })] }));
}
