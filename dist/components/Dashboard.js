import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../stores/auth';
import { DashboardStats } from './DashboardStats';
import { UpgradePrompt } from './UpgradePrompt';
export function Dashboard() {
    const { t } = useTranslation();
    const { user } = useAuth();
    useEffect(() => {
        document.title = 'Dashboard - JobNexus';
    }, []);
    return (_jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-8", children: [_jsx(motion.h1, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "text-2xl font-bold text-white", children: t('dashboard.welcome') }), _jsxs(motion.p, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "text-gray-400 mt-1", children: ["Bonjour ", (user === null || user === void 0 ? void 0 : user.full_name) || 'utilisateur'] })] }), _jsx(UpgradePrompt, {}), _jsx(DashboardStats, {})] }));
}
