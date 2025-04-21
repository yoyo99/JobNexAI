"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EducationSection = EducationSection;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const outline_1 = require("@heroicons/react/24/outline");
function EducationSection({ content, onChange }) {
    const addEducation = () => {
        const newEducation = {
            id: crypto.randomUUID(),
            degree: '',
            school: '',
            location: '',
            startDate: '',
            current: false,
        };
        onChange({
            items: [...content.items, newEducation],
        });
    };
    const updateEducation = (id, updates) => {
        onChange({
            items: content.items.map(item => item.id === id ? Object.assign(Object.assign({}, item), updates) : item),
        });
    };
    const removeEducation = (id) => {
        onChange({
            items: content.items.filter(item => item.id !== id),
        });
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [content.items.map((education, index) => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white/5 rounded-lg p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "text-white font-medium", children: ["Formation ", index + 1] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => removeEducation(education.id), className: "text-red-400 hover:text-red-300", children: (0, jsx_runtime_1.jsx)(outline_1.TrashIcon, { className: "h-5 w-5" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Dipl\u00F4me" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: education.degree, onChange: (e) => updateEducation(education.id, { degree: e.target.value }), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "\u00C9cole" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: education.school, onChange: (e) => updateEducation(education.id, { school: e.target.value }), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Localisation" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: education.location, onChange: (e) => updateEducation(education.id, { location: e.target.value }), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Date de d\u00E9but" }), (0, jsx_runtime_1.jsx)("input", { type: "month", value: education.startDate, onChange: (e) => updateEducation(education.id, { startDate: e.target.value }), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Date de fin" }), (0, jsx_runtime_1.jsx)("input", { type: "month", value: education.endDate, onChange: (e) => updateEducation(education.id, { endDate: e.target.value }), disabled: education.current, className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", id: `current-${education.id}`, checked: education.current, onChange: (e) => updateEducation(education.id, {
                                            current: e.target.checked,
                                            endDate: e.target.checked ? undefined : education.endDate,
                                        }), className: "rounded border-white/10 bg-white/5 text-primary-500 focus:ring-primary-500" }), (0, jsx_runtime_1.jsx)("label", { htmlFor: `current-${education.id}`, className: "text-sm text-gray-400", children: "En cours" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Description (optionnel)" }), (0, jsx_runtime_1.jsx)("textarea", { value: education.description, onChange: (e) => updateEducation(education.id, { description: e.target.value }), rows: 3, className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] })] })] }, education.id))), (0, jsx_runtime_1.jsx)("button", { onClick: addEducation, className: "w-full py-2 border-2 border-dashed border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors", children: "Ajouter une formation" })] }));
}
