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
exports.ProjectProposalModal = ProjectProposalModal;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@headlessui/react");
const outline_1 = require("@heroicons/react/24/outline");
function ProjectProposalModal({ isOpen, onClose, project, onSubmit }) {
    const [bidAmount, setBidAmount] = (0, react_1.useState)(Math.floor((project.budget_min + project.budget_max) / 2));
    const [deliveryTime, setDeliveryTime] = (0, react_1.useState)('2_weeks');
    const [coverLetter, setCoverLetter] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
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
    return ((0, jsx_runtime_1.jsxs)(react_2.Dialog, { open: isOpen, onClose: onClose, className: "relative z-50", children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black/75", "aria-hidden": "true" }), (0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 flex items-center justify-center p-4", children: (0, jsx_runtime_1.jsxs)(react_2.Dialog.Panel, { className: "w-full max-w-2xl rounded-lg bg-background p-6 shadow-xl", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(react_2.Dialog.Title, { className: "text-lg font-medium text-white", children: "Proposer mes services" }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-gray-400 hover:text-white transition-colors", children: (0, jsx_runtime_1.jsx)(outline_1.XMarkIcon, { className: "h-6 w-6" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-white", children: project.title }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-400", children: ["Client: ", project.client.name] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-400", children: ["Budget: ", project.budget_min, "\u20AC - ", project.budget_max, "\u20AC"] })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Votre tarif (\u20AC)" }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: bidAmount, onChange: (e) => setBidAmount(Number(e.target.value)), min: project.budget_min, max: project.budget_max, className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-500 mt-1", children: ["Proposez un montant entre ", project.budget_min, "\u20AC et ", project.budget_max, "\u20AC"] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "D\u00E9lai de livraison" }), (0, jsx_runtime_1.jsxs)("select", { value: deliveryTime, onChange: (e) => setDeliveryTime(e.target.value), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "1_week", children: "1 semaine" }), (0, jsx_runtime_1.jsx)("option", { value: "2_weeks", children: "2 semaines" }), (0, jsx_runtime_1.jsx)("option", { value: "1_month", children: "1 mois" }), (0, jsx_runtime_1.jsx)("option", { value: "2_months", children: "2 mois" }), (0, jsx_runtime_1.jsx)("option", { value: "3_months", children: "3 mois" }), (0, jsx_runtime_1.jsx)("option", { value: "custom", children: "D\u00E9lai personnalis\u00E9" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Lettre de motivation" }), (0, jsx_runtime_1.jsx)("textarea", { value: coverLetter, onChange: (e) => setCoverLetter(e.target.value), rows: 6, placeholder: "Pr\u00E9sentez-vous, expliquez pourquoi vous \u00EAtes qualifi\u00E9 pour ce projet et comment vous comptez l'aborder...", className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", required: true }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500 mt-1", children: "Minimum 100 caract\u00E8res, maximum 2000 caract\u00E8res" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end gap-4", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: onClose, className: "btn-secondary", children: "Annuler" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: loading || !coverLetter.trim() || coverLetter.length < 100, className: "btn-primary", children: loading ? 'Envoi en cours...' : 'Envoyer ma proposition' })] })] })] }) })] }));
}
