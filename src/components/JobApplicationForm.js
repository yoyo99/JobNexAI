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
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';
import { useAuth } from '../stores/auth';
export function JobApplicationForm({ isOpen, onClose, onSubmit, jobId }) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('draft');
    const [notes, setNotes] = useState('');
    const [nextStepDate, setNextStepDate] = useState('');
    const [nextStepType, setNextStepType] = useState('');
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        if (!user || !jobId)
            return;
        try {
            setLoading(true);
            const { error } = yield supabase
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
    return (_jsxs(Dialog, { open: isOpen, onClose: onClose, className: "relative z-50", children: [_jsx("div", { className: "fixed inset-0 bg-black/75", "aria-hidden": "true" }), _jsx("div", { className: "fixed inset-0 flex items-center justify-center p-4", children: _jsxs(Dialog.Panel, { className: "w-full max-w-md rounded-lg bg-background p-6 shadow-xl", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx(Dialog.Title, { className: "text-lg font-medium text-white", children: "Nouvelle candidature" }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-white transition-colors", children: _jsx(XMarkIcon, { className: "h-6 w-6" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Statut" }), _jsxs("select", { value: status, onChange: (e) => setStatus(e.target.value), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", children: [_jsx("option", { value: "draft", children: "Brouillon" }), _jsx("option", { value: "applied", children: "Postul\u00E9e" }), _jsx("option", { value: "interviewing", children: "En entretien" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Notes" }), _jsx("textarea", { value: notes, onChange: (e) => setNotes(e.target.value), className: "w-full h-32 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", placeholder: "Ajoutez vos notes ici..." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Prochaine \u00E9tape" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx("div", { children: _jsx("input", { type: "date", value: nextStepDate, onChange: (e) => setNextStepDate(e.target.value), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" }) }), _jsx("div", { children: _jsxs("select", { value: nextStepType, onChange: (e) => setNextStepType(e.target.value), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", children: [_jsx("option", { value: "", children: "Type d'\u00E9tape" }), _jsx("option", { value: "phone", children: "T\u00E9l\u00E9phone" }), _jsx("option", { value: "technical", children: "Technique" }), _jsx("option", { value: "hr", children: "RH" }), _jsx("option", { value: "final", children: "Final" }), _jsx("option", { value: "other", children: "Autre" })] }) })] })] }), _jsxs("div", { className: "flex justify-end gap-4 mt-6", children: [_jsx("button", { type: "button", onClick: onClose, className: "btn-secondary", children: "Annuler" }), _jsx("button", { type: "submit", disabled: loading, className: "btn-primary", children: loading ? 'Création...' : 'Créer la candidature' })] })] })] }) })] }));
}
