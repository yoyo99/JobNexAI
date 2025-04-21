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
exports.JobApplicationForm = JobApplicationForm;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@headlessui/react");
const outline_1 = require("@heroicons/react/24/outline");
const supabase_1 = require("../lib/supabase");
const auth_1 = require("../stores/auth");
function JobApplicationForm({ isOpen, onClose, onSubmit, jobId }) {
    const { user } = (0, auth_1.useAuth)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [status, setStatus] = (0, react_1.useState)('draft');
    const [notes, setNotes] = (0, react_1.useState)('');
    const [nextStepDate, setNextStepDate] = (0, react_1.useState)('');
    const [nextStepType, setNextStepType] = (0, react_1.useState)('');
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        if (!user || !jobId)
            return;
        try {
            setLoading(true);
            const { error } = yield supabase_1.supabase
                .from('job_applications')
                .insert({
                user_id: user.id,
                job_id: jobId,
                status,
                notes: notes || null,
                next_step_date: nextStepDate || null,
                next_step_type: nextStepType || null,
                applied_at: status === 'applied' ? new Date().toISOString() : null
            });
            if (error)
                throw error;
            onSubmit();
            onClose();
        }
        catch (error) {
            console.error('Error creating application:', error);
        }
        finally {
            setLoading(false);
        }
    });
    return ((0, jsx_runtime_1.jsxs)(react_2.Dialog, { open: isOpen, onClose: onClose, className: "relative z-50", children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/75", "aria-hidden": "true" }), (0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 flex items-center justify-center p-4", children: (0, jsx_runtime_1.jsxs)(react_2.Dialog.Panel, { className: "w-full max-w-md rounded-lg bg-background p-6 shadow-xl", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(react_2.Dialog.Title, { className: "text-lg font-medium text-white", children: "Nouvelle candidature" }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-gray-400 hover:text-white transition-colors", children: (0, jsx_runtime_1.jsx)(outline_1.XMarkIcon, { className: "h-6 w-6" }) })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Statut" }), (0, jsx_runtime_1.jsxs)("select", { value: status, onChange: (e) => setStatus(e.target.value), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "draft", children: "Brouillon" }), (0, jsx_runtime_1.jsx)("option", { value: "applied", children: "Postul\u00E9e" }), (0, jsx_runtime_1.jsx)("option", { value: "interviewing", children: "En entretien" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Notes" }), (0, jsx_runtime_1.jsx)("textarea", { value: notes, onChange: (e) => setNotes(e.target.value), className: "w-full h-32 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", placeholder: "Ajoutez vos notes ici..." })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Prochaine \u00E9tape" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("input", { type: "date", value: nextStepDate, onChange: (e) => setNextStepDate(e.target.value), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" }) }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("select", { value: nextStepType, onChange: (e) => setNextStepType(e.target.value), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "Type d'\u00E9tape" }), (0, jsx_runtime_1.jsx)("option", { value: "phone", children: "T\u00E9l\u00E9phone" }), (0, jsx_runtime_1.jsx)("option", { value: "technical", children: "Technique" }), (0, jsx_runtime_1.jsx)("option", { value: "hr", children: "RH" }), (0, jsx_runtime_1.jsx)("option", { value: "final", children: "Final" }), (0, jsx_runtime_1.jsx)("option", { value: "other", children: "Autre" })] }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end gap-4 mt-6", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: onClose, className: "btn-secondary", children: "Annuler" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: loading, className: "btn-primary", children: loading ? 'Création...' : 'Créer la candidature' })] })] })] }) })] }));
}
