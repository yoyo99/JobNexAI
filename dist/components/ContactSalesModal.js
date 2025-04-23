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
// Nécessite EmailJS (https://www.emailjs.com/) :
// SERVICE_ID : service_mua4t0l, TEMPLATE_ID : template_7fpilue, PUBLIC_KEY : O0LnolTBPNqbejzhl
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from 'emailjs-com';
export function ContactSalesModal({ open, onClose }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const SERVICE_ID = 'service_mua4t0l';
            const TEMPLATE_ID = 'template_7fpilue';
            const PUBLIC_KEY = 'O0LnolTBPNqbejzhl';
            const templateParams = {
                name,
                email,
                company,
                message,
            };
            yield emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
            setSent(true);
        }
        catch (err) {
            setError("Erreur lors de l'envoi. Réessaie plus tard.");
        }
        finally {
            setLoading(false);
        }
    });
    return (_jsx(AnimatePresence, { children: open && (_jsx(motion.div, { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsxs(motion.div, { className: "bg-[#181C23] rounded-xl shadow-xl w-full max-w-md p-8 relative", initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, children: [_jsx("button", { className: "absolute top-4 right-4 text-gray-400 hover:text-white text-2xl", onClick: onClose, "aria-label": "Fermer", disabled: loading, children: "\u00D7" }), sent ? (_jsxs("div", { className: "text-center space-y-4", children: [_jsx("div", { className: "text-green-400 text-3xl", children: "\u2713" }), _jsx("h2", { className: "text-xl font-bold text-white", children: "Message envoy\u00E9 !" }), _jsx("p", { className: "text-gray-300", children: "Merci, notre \u00E9quipe commerciale vous contactera rapidement." }), _jsx("button", { className: "btn-primary mt-4 w-full", onClick: onClose, children: "Fermer" })] })) : (_jsxs("form", { className: "space-y-5", onSubmit: handleSubmit, children: [_jsx("h2", { className: "text-xl font-bold text-white mb-2", children: "Contactez notre \u00E9quipe commerciale" }), _jsxs("div", { children: [_jsx("label", { htmlFor: "name", className: "block text-sm text-gray-300 mb-1", children: "Nom complet" }), _jsx("input", { id: "name", type: "text", className: "w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", value: name, onChange: e => setName(e.target.value), required: true })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm text-gray-300 mb-1", children: "Email" }), _jsx("input", { id: "email", type: "email", className: "w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", value: email, onChange: e => setEmail(e.target.value), required: true })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "company", className: "block text-sm text-gray-300 mb-1", children: "Soci\u00E9t\u00E9" }), _jsx("input", { id: "company", type: "text", className: "w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", value: company, onChange: e => setCompany(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "message", className: "block text-sm text-gray-300 mb-1", children: "Message" }), _jsx("textarea", { id: "message", rows: 4, className: "w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", value: message, onChange: e => setMessage(e.target.value), required: true })] }), error && _jsx("div", { className: "text-red-400 text-sm", children: error }), _jsx("button", { type: "submit", className: "btn-primary w-full", disabled: loading, children: loading ? 'Envoi…' : 'Envoyer' })] }))] }) })) }));
}
