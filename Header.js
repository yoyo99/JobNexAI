"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = Header;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@headlessui/react");
const outline_1 = require("@heroicons/react/24/outline");
const react_router_dom_1 = require("react-router-dom");
const LanguageSwitcher_1 = require("./LanguageSwitcher");
const react_i18next_1 = require("react-i18next");
const auth_1 = require("../stores/auth");
// Navigation pour les utilisateurs non connectés
const publicNavigation = [
    { name: 'Fonctionnalités', href: '/features' },
    { name: 'Comment ça marche', href: '/how-it-works' },
    { name: 'Tarifs', href: '/pricing' },
    { name: 'Témoignages', href: '/testimonials' },
];
// Navigation pour les utilisateurs connectés
const privateNavigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Job Search', href: '/jobs' },
    { name: 'Applications', href: '/applications' },
    { name: 'CV Builder', href: '/cv-builder' },
];
function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = (0, react_1.useState)(false);
    const { t } = (0, react_i18next_1.useTranslation)();
    const { user } = (0, auth_1.useAuth)();
    const location = (0, react_router_dom_1.useLocation)();
    // Utiliser la navigation publique pour les utilisateurs non connectés
    // et la navigation privée pour les utilisateurs connectés
    const navigation = user ? privateNavigation : publicNavigation;
    return ((0, jsx_runtime_1.jsxs)("header", { className: "fixed inset-x-0 top-0 z-50 backdrop-blur-sm border-b border-white/10", children: [(0, jsx_runtime_1.jsxs)("nav", { className: "flex items-center justify-between p-6 lg:px-8", "aria-label": "Global", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex lg:flex-1", children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/", className: "-m-1.5 p-1.5", children: [(0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: "JobNexAI" }), (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text", children: "JobNexAI" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex lg:hidden", children: (0, jsx_runtime_1.jsxs)("button", { type: "button", className: "-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white", onClick: () => setMobileMenuOpen(true), children: [(0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: "Open main menu" }), (0, jsx_runtime_1.jsx)(outline_1.Bars3Icon, { className: "h-6 w-6", "aria-hidden": "true" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "hidden lg:flex lg:gap-x-12", children: navigation.map((item) => ((0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: item.href, className: "text-sm font-semibold leading-6 text-white hover:text-primary-400 transition-colors", children: item.name }, item.name))) }), (0, jsx_runtime_1.jsxs)("div", { className: "hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-4", children: [(0, jsx_runtime_1.jsx)(LanguageSwitcher_1.LanguageSwitcher, {}), !user && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/login", className: "text-sm font-semibold px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-colors", children: t('auth.login') }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/pricing", className: "text-sm font-semibold px-3 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-500 hover:to-secondary-500 transition-colors", children: t('auth.startTrial') })] }))] })] }), (0, jsx_runtime_1.jsxs)(react_2.Dialog, { as: "div", className: "lg:hidden", open: mobileMenuOpen, onClose: setMobileMenuOpen, children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 z-50" }), (0, jsx_runtime_1.jsxs)(react_2.Dialog.Panel, { className: "fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/", className: "-m-1.5 p-1.5", children: [(0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: "JobNexAI" }), (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text", children: "JobNexAI" })] }), (0, jsx_runtime_1.jsxs)("button", { type: "button", className: "-m-2.5 rounded-md p-2.5 text-white", onClick: () => setMobileMenuOpen(false), children: [(0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: "Close menu" }), (0, jsx_runtime_1.jsx)(outline_1.XMarkIcon, { className: "h-6 w-6", "aria-hidden": "true" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 flow-root", children: (0, jsx_runtime_1.jsxs)("div", { className: "-my-6 divide-y divide-white/10", children: [(0, jsx_runtime_1.jsx)("div", { className: "space-y-2 py-6", children: navigation.map((item) => ((0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: item.href, className: "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-white/10", onClick: () => setMobileMenuOpen(false), children: item.name }, item.name))) }), (0, jsx_runtime_1.jsxs)("div", { className: "py-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-4", children: (0, jsx_runtime_1.jsx)(LanguageSwitcher_1.LanguageSwitcher, {}) }), !user && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/login", className: "block text-center text-sm font-semibold px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-colors", children: t('auth.login') }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/pricing", className: "block text-center text-sm font-semibold px-3 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-500 hover:to-secondary-500 transition-colors", children: t('auth.startTrial') })] }))] })] }) })] })] })] }));
}
