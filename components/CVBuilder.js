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
const framer_motion_1 = require("framer-motion");
const react_i18next_1 = require("react-i18next");
const auth_1 = require("../stores/auth");
const supabase_1 = require("../lib/supabase");
const outline_1 = require("@heroicons/react/24/outline");
function CVBuilder() {
    const { user } = (0, auth_1.useAuth)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const [sections, setSections] = (0, react_1.useState)([
        {
            id: 'education',
            type: 'education',
            title: 'Formation',
            items: []
        },
        {
            id: 'experience',
            type: 'experience',
            title: 'Expérience professionnelle',
            items: []
        },
        {
            id: 'skills',
            type: 'skills',
            title: 'Compétences',
            items: []
        }
    ]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [selectedSection, setSelectedSection] = (0, react_1.useState)(null);
    const [editingItem, setEditingItem] = (0, react_1.useState)(null);
    const addItem = (sectionId) => {
        setSections(prev => prev.map(section => {
            if (section.id === sectionId) {
                return Object.assign(Object.assign({}, section), { items: [...section.items, {
                            id: crypto.randomUUID(),
                            title: '',
                        }] });
            }
            return section;
        }));
    };
    const updateItem = (sectionId, itemId, updates) => {
        setSections(prev => prev.map(section => {
            if (section.id === sectionId) {
                return Object.assign(Object.assign({}, section), { items: section.items.map(item => item.id === itemId ? Object.assign(Object.assign({}, item), updates) : item) });
            }
            return section;
        }));
    };
    const removeItem = (sectionId, itemId) => {
        setSections(prev => prev.map(section => {
            if (section.id === sectionId) {
                return Object.assign(Object.assign({}, section), { items: section.items.filter(item => item.id !== itemId) });
            }
            return section;
        }));
    };
    const moveItem = (sectionId, itemId, direction) => {
        setSections(prev => prev.map(section => {
            if (section.id === sectionId) {
                const items = [...section.items];
                const index = items.findIndex(item => item.id === itemId);
                if (direction === 'up' && index > 0) {
                    // Ensure both items exist before swapping
                    const currentItem = items[index];
                    const previousItem = items[index - 1];
                    if (currentItem && previousItem) {
                        items[index] = previousItem;
                        items[index - 1] = currentItem;
                    }
                }
                else if (direction === 'down' && index < items.length - 1) {
                    // Ensure both items exist before swapping
                    const currentItem = items[index];
                    const nextItem = items[index + 1];
                    if (currentItem && nextItem) {
                        items[index] = nextItem;
                        items[index + 1] = currentItem;
                    }
                }
                return Object.assign(Object.assign({}, section), { items });
            }
            return section;
        }));
    };
    const saveCV = () => __awaiter(this, void 0, void 0, function* () {
        if (!user)
            return;
        try {
            setLoading(true);
            const { error } = yield supabase_1.supabase
                .from('user_cvs')
                .upsert({
                user_id: user.id,
                content: sections,
                updated_at: new Date().toISOString()
            });
            if (error)
                throw error;
        }
        catch (error) {
            console.error('Error saving CV:', error);
        }
        finally {
            setLoading(false);
        }
    });
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-4xl mx-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-8", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-white", children: "Cr\u00E9ateur de CV" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400 mt-1", children: "Cr\u00E9ez et personnalisez votre CV professionnel" })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-8", children: sections.map((section) => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "card", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-medium text-white", children: section.title }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => addItem(section.id), className: "btn-secondary flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(outline_1.PlusIcon, { className: "h-5 w-5" }), "Ajouter"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: section.items.map((item, index) => ((0, jsx_runtime_1.jsx)("div", { className: "bg-white/5 rounded-lg p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1 space-y-4", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: item.title, onChange: (e) => updateItem(section.id, item.id, { title: e.target.value }), placeholder: `Titre ${section.type === 'education' ? 'du diplôme' : 'du poste'}`, className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" }), section.type !== 'skills' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: item.subtitle, onChange: (e) => updateItem(section.id, item.id, { subtitle: e.target.value }), placeholder: section.type === 'education' ? "Nom de l'école" : "Nom de l'entreprise", className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)("input", { type: "month", value: item.startDate, onChange: (e) => updateItem(section.id, item.id, { startDate: e.target.value }), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" }), (0, jsx_runtime_1.jsx)("input", { type: "month", value: item.endDate, onChange: (e) => updateItem(section.id, item.id, { endDate: e.target.value }), disabled: item.current, className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", id: `current-${item.id}`, checked: item.current, onChange: (e) => updateItem(section.id, item.id, {
                                                                        current: e.target.checked,
                                                                        endDate: e.target.checked ? undefined : item.endDate
                                                                    }), className: "rounded border-white/10 bg-white/5 text-primary-500 focus:ring-primary-500" }), (0, jsx_runtime_1.jsx)("label", { htmlFor: `current-${item.id}`, className: "text-sm text-gray-400", children: "En cours" })] }), (0, jsx_runtime_1.jsx)("textarea", { value: item.description, onChange: (e) => updateItem(section.id, item.id, { description: e.target.value }), placeholder: "Description", rows: 3, className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-2 ml-4", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => moveItem(section.id, item.id, 'up'), disabled: index === 0, className: "p-1 text-gray-400 hover:text-white disabled:opacity-50", children: (0, jsx_runtime_1.jsx)(outline_1.ArrowUpIcon, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => moveItem(section.id, item.id, 'down'), disabled: index === section.items.length - 1, className: "p-1 text-gray-400 hover:text-white disabled:opacity-50", children: (0, jsx_runtime_1.jsx)(outline_1.ArrowDownIcon, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => removeItem(section.id, item.id), className: "p-1 text-gray-400 hover:text-red-400", children: (0, jsx_runtime_1.jsx)(outline_1.TrashIcon, { className: "h-5 w-5" }) })] })] }) }, item.id))) })] }, section.id))) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-8 flex justify-end", children: (0, jsx_runtime_1.jsx)("button", { onClick: saveCV, disabled: loading, className: "btn-primary", children: loading ? 'Enregistrement...' : 'Enregistrer le CV' }) })] }));
}
