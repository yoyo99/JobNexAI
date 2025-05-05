import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
/**
 * Sélecteur de moteur IA préféré + gestion des clés API utilisateur.
 * Options : OpenAI (défaut), Gemini, Claude, Cohere, HuggingFace, Mistral, IA interne.
 * Les clés API sont stockées côté Supabase si connecté, sinon localStorage.
 */
const IA_ENGINES = [
    { id: 'openai', label: 'OpenAI (GPT-3.5/4)', placeholder: 'sk-...' },
    { id: 'gemini', label: 'Google Gemini', placeholder: 'API Key Gemini' },
    { id: 'claude', label: 'Anthropic Claude', placeholder: 'sk-ant-' },
    { id: 'cohere', label: 'Cohere', placeholder: 'API Key Cohere' },
    { id: 'huggingface', label: 'HuggingFace', placeholder: 'hf_' },
    { id: 'mistral', label: 'Mistral AI', placeholder: 'API Key Mistral' },
    { id: 'custom', label: 'IA interne/maison', placeholder: 'Token interne' },
];
const UserAISettings = ({ userId, defaultEngine = 'openai', defaultApiKeys = {}, onChange }) => {
    var _a, _b;
    const [selectedEngine, setSelectedEngine] = useState(defaultEngine);
    const [apiKeys, setApiKeys] = useState(defaultApiKeys);
    // Effet pour charger/sauver les préférences (MVP: localStorage, TODO: Supabase)
    useEffect(() => {
        const saved = localStorage.getItem('user_ai_settings');
        if (saved) {
            const parsed = JSON.parse(saved);
            setSelectedEngine(parsed.engine || defaultEngine);
            setApiKeys(parsed.apiKeys || {});
        }
    }, [defaultEngine]);
    useEffect(() => {
        localStorage.setItem('user_ai_settings', JSON.stringify({ engine: selectedEngine, apiKeys }));
        if (onChange)
            onChange(selectedEngine, apiKeys);
    }, [selectedEngine, apiKeys, onChange]);
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-400 mb-1", children: "Moteur IA pr\u00E9f\u00E9r\u00E9" }), _jsx("select", { value: selectedEngine, onChange: e => setSelectedEngine(e.target.value), className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", children: IA_ENGINES.map(engine => (_jsx("option", { value: engine.id, children: engine.label }, engine.id))) }), _jsxs("label", { className: "block text-sm font-medium text-gray-400 mb-1 mt-4", children: ["Cl\u00E9 API pour ", (_a = IA_ENGINES.find(e => e.id === selectedEngine)) === null || _a === void 0 ? void 0 : _a.label] }), _jsx("input", { type: "text", value: apiKeys[selectedEngine] || '', onChange: e => setApiKeys(Object.assign(Object.assign({}, apiKeys), { [selectedEngine]: e.target.value })), placeholder: (_b = IA_ENGINES.find(e => e.id === selectedEngine)) === null || _b === void 0 ? void 0 : _b.placeholder, className: "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500", autoComplete: "off" }), _jsx("p", { className: "text-xs text-gray-400 mt-2", children: "La cl\u00E9 API n\u2019est jamais partag\u00E9e ni utilis\u00E9e sans ton accord. Elle est requise pour acc\u00E9der \u00E0 certains moteurs IA. Par d\u00E9faut, OpenAI est utilis\u00E9 si aucune cl\u00E9 n\u2019est fournie." })] }));
};
export default UserAISettings;
