import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
const defaultBadges = [
    { id: 'starter', label: 'badges.starter.label', description: 'badges.starter.description', icon: '🎉', unlocked: true },
    { id: 'first-app', label: 'badges.firstApp.label', description: 'badges.firstApp.description', icon: '🚀', unlocked: false },
    { id: 'networker', label: 'badges.networker.label', description: 'badges.networker.description', icon: '🤝', unlocked: false },
    { id: 'persistent', label: 'badges.persistent.label', description: 'badges.persistent.description', icon: '🔥', unlocked: false },
    { id: 'winner', label: 'badges.winner.label', description: 'badges.winner.description', icon: '🏆', unlocked: false },
];
const Badges = ({ badges = defaultBadges }) => {
    const { t } = useTranslation();
    return (_jsxs("div", { className: "prose mx-auto p-8 bg-background text-white rounded-lg max-w-3xl", children: [_jsx("h2", { className: "mb-4", children: t('badges.title') }), _jsx("div", { className: "flex flex-wrap gap-4", children: badges.map(badge => (_jsxs("div", { className: `flex flex-col items-center p-4 rounded-lg shadow-md w-36 h-36 transition-opacity ${badge.unlocked ? 'bg-primary-600/20 opacity-100' : 'bg-white/5 opacity-40'}`, children: [_jsx("span", { className: "text-4xl mb-2", children: badge.icon }), _jsx("span", { className: "font-semibold", children: t(badge.label) }), _jsx("span", { className: "text-xs text-gray-400 text-center mt-1", children: t(badge.description) }), !badge.unlocked && _jsx("span", { className: "mt-2 text-xs text-gray-400", children: t('badges.toUnlock') })] }, badge.id))) })] }));
};
export default Badges;
