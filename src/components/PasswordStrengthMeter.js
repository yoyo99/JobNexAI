import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
export function PasswordStrengthMeter({ password, onChange, }) {
    const [strength, setStrength] = useState(0);
    const [feedback, setFeedback] = useState([]);
    useEffect(() => {
        const newStrength = calculatePasswordStrength(password);
        setStrength(newStrength);
        setFeedback(getPasswordFeedback(password));
        onChange === null || onChange === void 0 ? void 0 : onChange(newStrength);
    }, [password, onChange]);
    return (_jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "h-2 bg-white/5 rounded-full overflow-hidden", children: _jsx(motion.div, { className: `h-full transition-colors ${getStrengthColor(strength)}`, initial: { width: 0 }, animate: { width: `${strength}%` } }) }), _jsx("div", { className: "space-y-1", children: feedback.map((item, index) => (_jsx("p", { className: `text-sm ${item.startsWith('✓') ? 'text-green-400' : 'text-gray-400'}`, children: item }, index))) })] }));
}
function calculatePasswordStrength(password) {
    if (!password)
        return 0;
    let score = 0;
    const minLength = 9;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    // Longueur (40%)
    score += Math.min((password.length / minLength) * 40, 40);
    // Complexité (60%)
    if (hasUpperCase)
        score += 15;
    if (hasLowerCase)
        score += 15;
    if (hasNumbers)
        score += 15;
    if (hasSpecialChars)
        score += 15;
    return Math.min(score, 100);
}
function getPasswordFeedback(password) {
    const feedback = [];
    const minLength = 9;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    feedback.push(password.length >= minLength
        ? `✓ Au moins ${minLength} caractères`
        : `✗ Au moins ${minLength} caractères`);
    feedback.push(hasUpperCase
        ? '✓ Au moins une majuscule'
        : '✗ Au moins une majuscule');
    feedback.push(hasLowerCase
        ? '✓ Au moins une minuscule'
        : '✗ Au moins une minuscule');
    feedback.push(hasNumbers
        ? '✓ Au moins un chiffre'
        : '✗ Au moins un chiffre');
    feedback.push(hasSpecialChars
        ? '✓ Au moins un caractère spécial'
        : '✗ Au moins un caractère spécial');
    return feedback;
}
function getStrengthColor(strength) {
    if (strength >= 80)
        return 'bg-green-500';
    if (strength >= 60)
        return 'bg-yellow-500';
    if (strength >= 40)
        return 'bg-orange-500';
    return 'bg-red-500';
}
