import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const defaultBadges = [
    { id: 'starter', label: 'Nouveau Talent', description: 'Inscription complétée', icon: '🎉', unlocked: true },
    { id: 'first-app', label: 'Première candidature', description: 'Vous avez postulé à un emploi', icon: '🚀', unlocked: false },
    { id: 'networker', label: 'Connecteur', description: 'Vous avez rejoint la communauté', icon: '🤝', unlocked: false },
    { id: 'persistent', label: 'Persévérant', description: '10 candidatures envoyées', icon: '🔥', unlocked: false },
    { id: 'winner', label: 'Embauché !', description: 'Vous avez accepté une offre', icon: '🏆', unlocked: false },
];
const Badges = ({ badges = defaultBadges }) => {
    return (_jsxs("div", { className: "prose mx-auto p-8 bg-background text-white rounded-lg max-w-3xl", children: [_jsx("h2", { className: "mb-4", children: "Mes badges" }), _jsx("div", { className: "flex flex-wrap gap-4", children: badges.map(badge => (_jsxs("div", { className: `flex flex-col items-center p-4 rounded-lg shadow-md w-36 h-36 transition-opacity ${badge.unlocked ? 'bg-primary-600/20 opacity-100' : 'bg-white/5 opacity-40'}`, children: [_jsx("span", { className: "text-4xl mb-2", children: badge.icon }), _jsx("span", { className: "font-semibold", children: badge.label }), _jsx("span", { className: "text-xs text-gray-400 text-center mt-1", children: badge.description }), !badge.unlocked && _jsx("span", { className: "mt-2 text-xs text-gray-400", children: "(\u00C0 d\u00E9bloquer)" })] }, badge.id))) })] }));
};
export default Badges;
