import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { matchScoreIA } from '../lib/aiRouter';
const MatchingIA = ({ userSkills, jobKeywords }) => {
    const [score, setScore] = useState(0);
    const [engine, setEngine] = useState('openai');
    useEffect(() => {
        // Récupère le moteur IA et la clé API depuis le localStorage (MVP)
        const settings = localStorage.getItem('user_ai_settings');
        let selectedEngine = 'openai';
        let apiKeys = {};
        if (settings) {
            try {
                const parsed = JSON.parse(settings);
                selectedEngine = parsed.engine || 'openai';
                apiKeys = parsed.apiKeys || {};
            }
            catch (_a) { }
        }
        setEngine(selectedEngine);
        matchScoreIA(userSkills, jobKeywords, { engine: selectedEngine, apiKeys }).then(setScore);
    }, [userSkills, jobKeywords]);
    return (_jsxs("div", { className: "border border-primary-400 rounded-lg p-4 my-4 bg-background/60", children: [_jsx("h2", { className: "text-lg font-semibold mb-2", children: "Compatibilit\u00E9 IA" }), _jsxs("p", { className: "mb-1", children: ["Score de compatibilit\u00E9 : ", _jsxs("span", { className: "font-bold text-primary-400", children: [score, "%"] })] }), _jsxs("p", { className: "text-xs text-gray-400", children: ["(Calcul r\u00E9alis\u00E9 via\u00A0", _jsx("span", { className: "font-semibold", children: engine.charAt(0).toUpperCase() + engine.slice(1) }), ". S\u00E9lectionnable dans le profil.)"] })] }));
};
export default MatchingIA;
