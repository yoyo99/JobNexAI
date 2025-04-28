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
export default function ContactForm() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState(null);
    const handleChange = (e) => {
        setForm(Object.assign(Object.assign({}, form), { [e.target.name]: e.target.value }));
    };
    const handleSubmit = (e) => __awaiter(this, void 0, void 0, function* () {
        e.preventDefault();
        setStatus('sending');
        setError(null);
        try {
            const res = yield fetch('/.netlify/functions/sendMail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: 'contact@jobnexai.com', // Change to your destination email
                    subject: `Contact JobNexAI: ${form.name}`,
                    text: `Message de ${form.name} <${form.email}> :\n\n${form.message}`,
                }),
            });
            if (res.ok) {
                setStatus('success');
                setForm({ name: '', email: '', message: '' });
            }
            else {
                const err = yield res.text();
                setStatus('error');
                setError(err);
            }
        }
        catch (err) {
            setStatus('error');
            setError(err.message || 'Erreur inconnue');
        }
    });
    return (_jsxs("form", { onSubmit: handleSubmit, className: "max-w-lg mx-auto p-6 bg-background rounded-lg shadow-md space-y-4", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Contactez-nous" }), _jsxs("div", { children: [_jsx("label", { htmlFor: "name", className: "block font-semibold mb-1", children: "Nom" }), _jsx("input", { type: "text", name: "name", id: "name", value: form.name, onChange: handleChange, required: true, className: "w-full p-2 rounded border border-gray-300 text-black" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block font-semibold mb-1", children: "Email" }), _jsx("input", { type: "email", name: "email", id: "email", value: form.email, onChange: handleChange, required: true, className: "w-full p-2 rounded border border-gray-300 text-black" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "message", className: "block font-semibold mb-1", children: "Message" }), _jsx("textarea", { name: "message", id: "message", value: form.message, onChange: handleChange, required: true, rows: 5, className: "w-full p-2 rounded border border-gray-300 text-black" })] }), _jsx("button", { type: "submit", className: "bg-primary-400 text-white px-4 py-2 rounded hover:bg-primary-500 disabled:opacity-50", disabled: status === 'sending', children: status === 'sending' ? 'Envoi en cours…' : 'Envoyer' }), status === 'success' && _jsx("p", { className: "text-green-600 font-semibold", children: "Message envoy\u00E9 avec succ\u00E8s !" }), status === 'error' && _jsxs("p", { className: "text-red-600 font-semibold", children: ["Erreur : ", error] })] }));
}
