"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExperienceSection = ExperienceSection;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const outline_1 = require("@heroicons/react/24/outline");
function ExperienceSection({ content, onChange }) {
    const addExperience = () => {
        const newExperience = {
            id: crypto.randomUUID(),
            title: '',
            company: '',
            location: '',
            startDate: '',
            current: false,
            description: '',
            achievements: [],
        };
        onChange({
            items: [...content.items, newExperience],
        });
    };
    const updateExperience = (id, updates) => {
        onChange({
            items: content.items.map(item => item.id === id ? Object.assign(Object.assign({}, item), updates) : item),
        });
    };
    const removeExperience = (id) => {
        onChange({
            items: content.items.filter(item => item.id !== id),
        });
    };
    const addAchievement = (experienceId) => {
        onChange({
            items: content.items.map(item => item.id === experienceId
                ? Object.assign(Object.assign({}, item), { achievements: [...item.achievements, ''] }) : item),
        });
    };
    const updateAchievement = (experienceId, index, value) => {
        onChange({
            items: content.items.map(item => item.id === experienceId
                ? Object.assign(Object.assign({}, item), { achievements: item.achievements.map((a, i) => i === index ? value : a) }) : item),
        });
    };
    const removeAchievement = (experienceId, index) => {
        onChange({
            items: content.items.map(item => item.id === experienceId
                ? Object.assign(Object.assign({}, item), { achievements: item.achievements.filter((_, i) => i !== index) }) : item),
        });
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [content.items.map((experience, index) => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white/5 rounded-lg p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-4", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "text-white font-medium", children: ["Exp\u00E9rience ", index + 1] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => removeExperience(experience.id), className: "text-red-400 hover:text-red-300", children: (0, jsx_runtime_1.jsx)(outline_1.TrashIcon, { className: "h-5 w-5" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Titre du poste" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: experience.title, onChange: (e) => updateExperience(experience.id, { title: e.target.value }), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Entreprise" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: experience.company, onChange: (e) => updateExperience(experience.id, { company: e.target.value }), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Localisation" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: experience.location, onChange: (e) => updateExperience(experience.id, { location: e.target.value }), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Date de d\u00E9but" }), (0, jsx_runtime_1.jsx)("input", { type: "month", value: experience.startDate, onChange: (e) => updateExperience(experience.id, { startDate: e.target.value }), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Date de fin" }), (0, jsx_runtime_1.jsx)("input", { type: "month", value: experience.endDate, onChange: (e) => updateExperience(experience.id, { endDate: e.target.value }), disabled: experience.current, className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", id: `current-${experience.id}`, checked: experience.current, onChange: (e) => updateExperience(experience.id, {
                                            current: e.target.checked,
                                            endDate: e.target.checked ? undefined : experience.endDate,
                                        }), className: "rounded border-white/10 bg-white/5 text-primary-500 focus:ring-primary-500" }), (0, jsx_runtime_1.jsx)("label", { htmlFor: `current-${experience.id}`, className: "text-sm text-gray-400", children: "Poste actuel" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Description" }), (0, jsx_runtime_1.jsx)("textarea", { value: experience.description, onChange: (e) => updateExperience(experience.id, { description: e.target.value }), rows: 3, className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400", children: "R\u00E9alisations" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => addAchievement(experience.id), className: "text-primary-400 hover:text-primary-300", children: (0, jsx_runtime_1.jsx)(outline_1.PlusIcon, { className: "h-5 w-5" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: experience.achievements.map((achievement, i) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: achievement, onChange: (e) => updateAchievement(experience.id, i, e.target.value), className: "flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => removeAchievement(experience.id, i), className: "text-red-400 hover:text-red-300", children: (0, jsx_runtime_1.jsx)(outline_1.TrashIcon, { className: "h-5 w-5" }) })] }, i))) })] })] })] }, experience.id))), (0, jsx_runtime_1.jsx)("button", { onClick: addExperience, className: "w-full py-2 border-2 border-dashed border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors", children: "Ajouter une exp\u00E9rience" })] }));
}
