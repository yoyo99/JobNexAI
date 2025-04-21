"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityBadge = SecurityBadge;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const outline_1 = require("@heroicons/react/24/outline");
const react_i18next_1 = require("react-i18next");
function SecurityBadge() {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: "fixed bottom-4 right-4 z-40", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-white/5 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/10", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(outline_1.ShieldCheckIcon, { className: "h-5 w-5 text-primary-400" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs", children: [(0, jsx_runtime_1.jsx)("p", { className: "font-medium text-white", children: "ISO 27001" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "RGPD compliant" })] })] }) }) }));
}
