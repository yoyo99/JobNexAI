"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dashboard = Dashboard;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const react_i18next_1 = require("react-i18next");
const auth_1 = require("../stores/auth");
const DashboardStats_1 = require("./DashboardStats");
const UpgradePrompt_1 = require("./UpgradePrompt");
function Dashboard() {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { user } = (0, auth_1.useAuth)();
    (0, react_1.useEffect)(() => {
        document.title = 'Dashboard - JobNexus';
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "max-w-7xl mx-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-8", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.h1, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "text-2xl font-bold text-white", children: t('dashboard.welcome') }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.p, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "text-gray-400 mt-1", children: ["Bonjour ", (user === null || user === void 0 ? void 0 : user.full_name) || 'utilisateur'] })] }), (0, jsx_runtime_1.jsx)(UpgradePrompt_1.UpgradePrompt, {}), (0, jsx_runtime_1.jsx)(DashboardStats_1.DashboardStats, {})] }));
}
