import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { TrashIcon } from '@heroicons/react/24/outline';
export function SkillsSection({ content, onChange }) {
    const addCategory = () => {
        const newCategory = {
            id: crypto.randomUUID(),
            name: '',
            skills: [],
        };
        onChange({
            categories: [...content.categories, newCategory],
        });
    };
    const updateCategory = (id, updates) => {
        onChange({
            categories: content.categories.map(category => category.id === id ? Object.assign(Object.assign({}, category), updates) : category),
        });
    };
    const removeCategory = (id) => {
        onChange({
            categories: content.categories.filter(category => category.id !== id),
        });
    };
    const addSkill = (categoryId) => {
        onChange({
            categories: content.categories.map(category => category.id === categoryId
                ? Object.assign(Object.assign({}, category), { skills: [...category.skills, ''] }) : category),
        });
    };
    const updateSkill = (categoryId, index, value) => {
        onChange({
            categories: content.categories.map(category => category.id === categoryId
                ? Object.assign(Object.assign({}, category), { skills: category.skills.map((skill, i) => i === index ? value : skill) }) : category),
        });
    };
    const removeSkill = (categoryId, index) => {
        onChange({
            categories: content.categories.map(category => category.id === categoryId
                ? Object.assign(Object.assign({}, category), { skills: category.skills.filter((_, i) => i !== index) }) : category),
        });
    };
    return (_jsxs("div", { className: "space-y-6", children: [content.categories.map((category, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white/5 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsx("div", { className: "flex-1", children: _jsx("input", { type: "text", value: category.name, onChange: (e) => updateCategory(category.id, { name: e.target.value }), placeholder: "Nom de la cat\u00E9gorie", className: "w-full bg-transparent text-white font-medium focus:outline-none" }) }), _jsx("button", { onClick: () => removeCategory(category.id), className: "text-red-400 hover:text-red-300", children: _jsx(TrashIcon, { className: "h-5 w-5" }) })] }), _jsxs("div", { className: "space-y-2", children: [category.skills.map((skill, i) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "text", value: skill, onChange: (e) => updateSkill(category.id, i, e.target.value), className: "flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" }), _jsx("button", { onClick: () => removeSkill(category.id, i), className: "text-red-400 hover:text-red-300", children: _jsx(TrashIcon, { className: "h-5 w-5" }) })] }, i))), _jsx("button", { onClick: () => addSkill(category.id), className: "w-full py-2 border-2 border-dashed border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors", children: "Ajouter une comp\u00E9tence" })] })] }, category.id))), _jsx("button", { onClick: addCategory, className: "w-full py-2 border-2 border-dashed border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors", children: "Ajouter une cat\u00E9gorie" })] }));
}
