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
export function ProjectProposalModal({ isOpen, onClose, project, onSubmit }) {
    const [bidAmount, setBidAmount] = useState(Math.floor((project.budget_min + project.budget_max) / 2));
    const [deliveryTime, setDeliveryTime] = useState('2_weeks');
    const [coverLetter, setCoverLetter] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        if (!coverLetter.trim()) {
            return;
        }
        try {
            setLoading(true);
            yield onSubmit(project.id, {
                bidAmount,
                deliveryTime,
                coverLetter
            });
        }
        catch (error) {
            console.error('Error submitting proposal:', error);
        }
        finally {
            setLoading(false);
        }
    });
    return (_jsxs(Dialog, { open: isOpen, onClose: onClose, className: "relative z-50", children: [_jsx("div", { className: "fixed inset-0 bg-black/75", "aria-hidden": "true" }), _jsx("div", { className: "fixed inset-0 flex items-center justify-center p-4", children: _jsxs(Dialog.Panel, { className: "w-full max-w-2xl rounded-lg bg-background p-6 shadow-xl", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx(Dialog.Title, { className: "text-lg font-medium text-white", children: "Proposer mes services" }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-white transition-colors", children: _jsx(XMarkIcon, { className: "h-6 w-6" }) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-xl font-semibold text-white", children: project.title }), _jsxs("p", { className: "text-gray-400", children: ["Client: ", project.client.name] }), _jsxs("p", { className: "text-gray-400", children: ["Budget: ", project.budget_min, "\u20AC - ", project.budget_max, "\u20AC"] })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Votre tarif (\u20AC)" }), _jsx("input", { type: "number", value: bidAmount, onChange: (e) => setBidAmount(Number(e.target.value)), min: project.budget_min, max: project.budget_max, className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" }), _jsxs("p", { className: "text-sm text-gray-500 mt-1", children: ["Proposez un montant entre ", project.budget_min, "\u20AC et ", project.budget_max, "\u20AC"] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "D\u00E9lai de livraison" }), _jsxs("select", { value: deliveryTime, onChange: (e) => setDeliveryTime(e.target.value), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", children: [_jsx("option", { value: "1_week", children: "1 semaine" }), _jsx("option", { value: "2_weeks", children: "2 semaines" }), _jsx("option", { value: "1_month", children: "1 mois" }), _jsx("option", { value: "2_months", children: "2 mois" }), _jsx("option", { value: "3_months", children: "3 mois" }), _jsx("option", { value: "custom", children: "D\u00E9lai personnalis\u00E9" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Lettre de motivation" }), _jsx("textarea", { value: coverLetter, onChange: (e) => setCoverLetter(e.target.value), rows: 6, placeholder: "Pr\u00E9sentez-vous, expliquez pourquoi vous \u00EAtes qualifi\u00E9 pour ce projet et comment vous comptez l'aborder...", className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", required: true }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Minimum 100 caract\u00E8res, maximum 2000 caract\u00E8res" })] }), _jsxs("div", { className: "flex justify-end gap-4", children: [_jsx("button", { type: "button", onClick: onClose, className: "btn-secondary", children: "Annuler" }), _jsx("button", { type: "submit", disabled: loading || !coverLetter.trim() || coverLetter.length < 100, className: "btn-primary", children: loading ? 'Envoi en cours...' : 'Envoyer ma proposition' })] })] })] }) })] }));
}
