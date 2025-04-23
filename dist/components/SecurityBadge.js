import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
export function SecurityBadge() {
    const { t } = useTranslation();
    return (_jsx(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: "fixed bottom-4 right-4 z-40", children: _jsx("div", { className: "bg-white/5 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/10", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ShieldCheckIcon, { className: "h-5 w-5 text-primary-400" }), _jsxs("div", { className: "text-xs", children: [_jsx("p", { className: "font-medium text-white", children: "ISO 27001" }), _jsx("p", { className: "text-gray-400", children: "RGPD compliant" })] })] }) }) }));
}
