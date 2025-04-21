import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
export function ProjectsSection({ content, onChange }) {
    const addProject = () => {
        const newProject = {
            id: crypto.randomUUID(),
            name: '',
            description: '',
            technologies: [],
            startDate: '',
            current: false,
        };
        onChange({
            items: [...content.items, newProject],
        });
    };
    const updateProject = (id, updates) => {
        onChange({
            items: content.items.map(item => item.id === id ? Object.assign(Object.assign({}, item), updates) : item),
        });
    };
    const removeProject = (id) => {
        onChange({
            items: content.items.filter(item => item.id !== id),
        });
    };
    const addTechnology = (projectId) => {
        onChange({
            items: content.items.map(item => item.id === projectId
                ? Object.assign(Object.assign({}, item), { technologies: [...item.technologies, ''] }) : item),
        });
    };
    const updateTechnology = (projectId, index, value) => {
        onChange({
            items: content.items.map(item => item.id === projectId
                ? Object.assign(Object.assign({}, item), { technologies: item.technologies.map((tech, i) => i === index ? value : tech) }) : item),
        });
    };
    const removeTechnology = (projectId, index) => {
        onChange({
            items: content.items.map(item => item.id === projectId
                ? Object.assign(Object.assign({}, item), { technologies: item.technologies.filter((_, i) => i !== index) }) : item),
        });
    };
    return (_jsxs("div", { className: "space-y-6", children: [content.items.map((project, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white/5 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("h4", { className: "text-white font-medium", children: ["Projet ", index + 1] }), _jsx("button", { onClick: () => removeProject(project.id), className: "text-red-400 hover:text-red-300", children: _jsx(TrashIcon, { className: "h-5 w-5" }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Nom du projet" }), _jsx("input", { type: "text", value: project.name, onChange: (e) => updateProject(project.id, { name: e.target.value }), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Description" }), _jsx("textarea", { value: project.description, onChange: (e) => updateProject(project.id, { description: e.target.value }), rows: 3, className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "URL du projet (optionnel)" }), _jsx("input", { type: "url", value: project.url, onChange: (e) => updateProject(project.id, { url: e.target.value }), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Date de d\u00E9but" }), _jsx("input", { type: "month", value: project.startDate, onChange: (e) => updateProject(project.id, { startDate: e.target.value }), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Date de fin" }), _jsx("input", { type: "month", value: project.endDate, onChange: (e) => updateProject(project.id, { endDate: e.target.value }), disabled: project.current, className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50" })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", id: `current-${project.id}`, checked: project.current, onChange: (e) => updateProject(project.id, {
                                            current: e.target.checked,
                                            endDate: e.target.checked ? undefined : project.endDate,
                                        }), className: "rounded border-white/10 bg-white/5 text-primary-500 focus:ring-primary-500" }), _jsx("label", { htmlFor: `current-${project.id}`, className: "text-sm text-gray-400", children: "Projet en cours" })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-400", children: "Technologies utilis\u00E9es" }), _jsx("button", { onClick: () => addTechnology(project.id), className: "text-primary-400 hover:text-primary-300", children: _jsx(PlusIcon, { className: "h-5 w-5" }) })] }), _jsx("div", { className: "space-y-2", children: project.technologies.map((tech, i) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "text", value: tech, onChange: (e) => updateTechnology(project.id, i, e.target.value), className: "flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" }), _jsx("button", { onClick: () => removeTechnology(project.id, i), className: "text-red-400 hover:text-red-300", children: _jsx(TrashIcon, { className: "h-5 w-5" }) })] }, i))) })] })] })] }, project.id))), _jsx("button", { onClick: addProject, className: "w-full py-2 border-2 border-dashed border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors", children: "Ajouter un projet" })] }));
}
