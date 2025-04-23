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
// 1. Installer emailjs-com : npm install emailjs-com
// 2. Créer un service, un template et utiliser l'user ID fournis par EmailJS
// 3. Configurer le template pour envoyer à boltsaas01@gmail.com
import { useState } from 'react';
import emailjs from 'emailjs-com';
export function FeedbackModal({ open, onClose }) {
    const [type, setType] = useState('bug');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // Remplacez ces valeurs par celles de votre compte EmailJS
            // À compléter avec vos identifiants EmailJS
            const SERVICE_ID = 'service_mua4t0l';
            const TEMPLATE_ID = 'template_7fpilue';
            const PUBLIC_KEY = 'O0LnolTBPNqbejzhl';
            const templateParams = {
                type,
                message,
                email,
            };
            yield emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
            setSent(true);
        }
        catch (err) {
            setError("Erreur lors de l'envoi. Veuillez réessayer.");
        }
        finally {
            setLoading(false);
        }
    });
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative", children: [_jsx("button", { className: "absolute top-2 right-2 text-gray-400 hover:text-gray-700", onClick: onClose, "aria-label": "Fermer", children: "\u00D7" }), _jsx("h2", { className: "text-xl font-bold mb-4 text-gray-900", children: "Remonter un bug ou une id\u00E9e" }), sent ? (_jsx("div", { className: "text-green-600 text-center font-semibold", children: "Merci pour votre retour !" })) : (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "flex gap-4", children: [_jsxs("label", { className: "flex items-center gap-1", children: [_jsx("input", { type: "radio", name: "type", value: "bug", checked: type === 'bug', onChange: () => setType('bug') }), "Bug"] }), _jsxs("label", { className: "flex items-center gap-1", children: [_jsx("input", { type: "radio", name: "type", value: "idea", checked: type === 'idea', onChange: () => setType('idea') }), "Id\u00E9e"] })] }), _jsx("div", { children: _jsx("textarea", { className: "w-full border rounded p-2 min-h-[80px]", placeholder: type === 'bug' ? 'Décrivez le bug rencontré...' : 'Décrivez votre idée...', value: message, required: true, onChange: e => setMessage(e.target.value) }) }), _jsx("div", { children: _jsx("input", { className: "w-full border rounded p-2", type: "email", placeholder: "Votre email (optionnel)", value: email, onChange: e => setEmail(e.target.value) }) }), error && _jsx("div", { className: "text-red-600 text-sm", children: error }), _jsx("button", { type: "submit", className: "btn-primary w-full", disabled: loading, children: loading ? 'Envoi...' : 'Envoyer' })] }))] }) }));
}
