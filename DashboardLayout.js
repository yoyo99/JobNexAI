"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardLayout = DashboardLayout;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@headlessui/react");
const outline_1 = require("@heroicons/react/24/outline");
const react_router_dom_1 = require("react-router-dom");
const react_i18next_1 = require("react-i18next");
const cn_1 = require("../utils/cn");
const auth_1 = require("../stores/auth");
const LanguageSwitcher_1 = require("./LanguageSwitcher");
const NotificationCenter_1 = require("./NotificationCenter");
function DashboardLayout() {
    var _a, _b, _c;
    const [sidebarOpen, setSidebarOpen] = (0, react_1.useState)(false);
    const { user, signOut } = (0, auth_1.useAuth)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const location = (0, react_router_dom_1.useLocation)();
    const [navigation, setNavigation] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        // Définir la navigation en fonction du type d'utilisateur
        if ((user === null || user === void 0 ? void 0 : user.user_type) === 'freelancer') {
            setNavigation([
                { name: 'Dashboard', href: '/dashboard', icon: outline_1.HomeIcon },
                { name: 'Projets disponibles', href: '/freelance/projects', icon: outline_1.RectangleGroupIcon },
                { name: 'Mon profil freelance', href: '/freelance/profile', icon: outline_1.UserIcon },
                { name: 'CV Builder', href: '/cv-builder', icon: outline_1.DocumentTextIcon },
                { name: 'Réseau', href: '/network', icon: outline_1.UsersIcon },
                { name: 'Analyse du marché', href: '/market-analysis', icon: outline_1.ChartPieIcon },
                { name: 'Facturation', href: '/billing', icon: outline_1.CreditCardIcon },
            ]);
        }
        else if ((user === null || user === void 0 ? void 0 : user.user_type) === 'recruiter') {
            setNavigation([
                { name: 'Dashboard', href: '/recruiter/dashboard', icon: outline_1.HomeIcon },
                { name: 'Recherche de candidats', href: '/recruiter/candidates', icon: outline_1.MagnifyingGlassIcon },
                { name: 'Mes offres d\'emploi', href: '/recruiter/job-postings', icon: outline_1.ClipboardDocumentListIcon },
                { name: 'Créer une offre', href: '/recruiter/create-job', icon: outline_1.PlusCircleIcon },
                { name: 'Réseau', href: '/network', icon: outline_1.UsersIcon },
                { name: 'Profil', href: '/profile', icon: outline_1.UserIcon },
                { name: 'Facturation', href: '/billing', icon: outline_1.CreditCardIcon },
            ]);
        }
        else {
            // Navigation par défaut pour les candidats
            setNavigation([
                { name: 'navigation.dashboard', href: '/dashboard', icon: outline_1.HomeIcon },
                { name: 'navigation.jobSearch', href: '/jobs', icon: outline_1.FolderIcon },
                { name: 'navigation.applications', href: '/applications', icon: outline_1.ClipboardDocumentListIcon },
                { name: 'navigation.cvBuilder', href: '/cv-builder', icon: outline_1.DocumentTextIcon },
                { name: 'navigation.network', href: '/network', icon: outline_1.UsersIcon },
                { name: 'navigation.marketAnalysis', href: '/market-analysis', icon: outline_1.ChartPieIcon },
                { name: 'navigation.profile', href: '/profile', icon: outline_1.UserIcon },
                { name: 'Facturation', href: '/billing', icon: outline_1.CreditCardIcon },
            ]);
        }
    }, [user === null || user === void 0 ? void 0 : user.user_type, t]);
    const handleSignOut = () => __awaiter(this, void 0, void 0, function* () {
        yield signOut();
        navigate('/login');
    });
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(react_2.Transition.Root, { show: sidebarOpen, as: react_1.Fragment, children: (0, jsx_runtime_1.jsxs)(react_2.Dialog, { as: "div", className: "relative z-50 lg:hidden", onClose: setSidebarOpen, children: [(0, jsx_runtime_1.jsx)(react_2.Transition.Child, { as: react_1.Fragment, enter: "transition-opacity ease-linear duration-300", enterFrom: "opacity-0", enterTo: "opacity-100", leave: "transition-opacity ease-linear duration-300", leaveFrom: "opacity-100", leaveTo: "opacity-0", children: (0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-gray-900/80" }) }), (0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 flex", children: (0, jsx_runtime_1.jsx)(react_2.Transition.Child, { as: react_1.Fragment, enter: "transition ease-in-out duration-300 transform", enterFrom: "-translate-x-full", enterTo: "translate-x-0", leave: "transition ease-in-out duration-300 transform", leaveFrom: "translate-x-0", leaveTo: "-translate-x-full", children: (0, jsx_runtime_1.jsxs)(react_2.Dialog.Panel, { className: "relative mr-16 flex w-full max-w-xs flex-1", children: [(0, jsx_runtime_1.jsx)(react_2.Transition.Child, { as: react_1.Fragment, enter: "ease-in-out duration-300", enterFrom: "opacity-0", enterTo: "opacity-100", leave: "ease-in-out duration-300", leaveFrom: "opacity-100", leaveTo: "opacity-0", children: (0, jsx_runtime_1.jsx)("div", { className: "absolute left-full top-0 flex w-16 justify-center pt-5", children: (0, jsx_runtime_1.jsxs)("button", { type: "button", className: "-m-2.5 p-2.5", onClick: () => setSidebarOpen(false), children: [(0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: "Close sidebar" }), (0, jsx_runtime_1.jsx)(outline_1.XMarkIcon, { className: "h-6 w-6 text-white", "aria-hidden": "true" })] }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex grow flex-col gap-y-5 overflow-y-auto bg-background px-6 pb-4 ring-1 ring-white/10", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex h-16 shrink-0 items-center", children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/", className: "text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text", children: "JobNexus" }) }), (0, jsx_runtime_1.jsx)("nav", { className: "flex flex-1 flex-col", children: (0, jsx_runtime_1.jsx)("ul", { role: "list", className: "flex flex-1 flex-col gap-y-7", children: (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)("ul", { role: "list", className: "-mx-2 space-y-1", children: navigation.map((item) => ((0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: item.href, className: (0, cn_1.cn)('text-gray-400 hover:text-white hover:bg-gray-800 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold', location.pathname === item.href && 'bg-gray-800 text-white'), children: [(0, jsx_runtime_1.jsx)(item.icon, { className: "h-6 w-6 shrink-0", "aria-hidden": "true" }), typeof item.name === 'string' && item.name.startsWith('navigation.')
                                                                                ? t(item.name)
                                                                                : item.name] }) }, item.name))) }) }) }) })] })] }) }) })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex grow flex-col gap-y-5 overflow-y-auto bg-background px-6 pb-4 border-r border-white/10", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex h-16 shrink-0 items-center", children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/", className: "text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text", children: "JobNexus" }) }), (0, jsx_runtime_1.jsx)("nav", { className: "flex flex-1 flex-col", children: (0, jsx_runtime_1.jsx)("ul", { role: "list", className: "flex flex-1 flex-col gap-y-7", children: (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)("ul", { role: "list", className: "-mx-2 space-y-1", children: navigation.map((item) => ((0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: item.href, className: (0, cn_1.cn)('text-gray-400 hover:text-white hover:bg-gray-800 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold', location.pathname === item.href && 'bg-gray-800 text-white'), children: [(0, jsx_runtime_1.jsx)(item.icon, { className: "h-6 w-6 shrink-0", "aria-hidden": "true" }), typeof item.name === 'string' && item.name.startsWith('navigation.')
                                                        ? t(item.name)
                                                        : item.name] }) }, item.name))) }) }) }) })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "lg:pl-72", children: [(0, jsx_runtime_1.jsxs)("div", { className: "sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-white/10 bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8", children: [(0, jsx_runtime_1.jsxs)("button", { type: "button", className: "-m-2.5 p-2.5 text-white lg:hidden", onClick: () => setSidebarOpen(true), children: [(0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: "Open sidebar" }), (0, jsx_runtime_1.jsx)(outline_1.Bars3Icon, { className: "h-6 w-6", "aria-hidden": "true" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-1 gap-x-4 self-stretch lg:gap-x-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex flex-1" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-x-4 lg:gap-x-6", children: [(0, jsx_runtime_1.jsx)(LanguageSwitcher_1.LanguageSwitcher, {}), (0, jsx_runtime_1.jsx)(NotificationCenter_1.NotificationCenter, {}), (0, jsx_runtime_1.jsxs)(react_2.Menu, { as: "div", className: "relative", children: [(0, jsx_runtime_1.jsxs)(react_2.Menu.Button, { className: "-m-1.5 flex items-center p-1.5", children: [(0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: "Open user menu" }), (0, jsx_runtime_1.jsx)("div", { className: "h-8 w-8 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center text-white font-semibold", children: ((_a = user === null || user === void 0 ? void 0 : user.full_name) === null || _a === void 0 ? void 0 : _a[0]) || ((_c = (_b = user === null || user === void 0 ? void 0 : user.email) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.toUpperCase()) || 'U' })] }), (0, jsx_runtime_1.jsx)(react_2.Transition, { as: react_1.Fragment, enter: "transition ease-out duration-100", enterFrom: "transform opacity-0 scale-95", enterTo: "transform opacity-100 scale-100", leave: "transition ease-in duration-75", leaveFrom: "transform opacity-100 scale-100", leaveTo: "transform opacity-0 scale-95", children: (0, jsx_runtime_1.jsxs)(react_2.Menu.Items, { className: "absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none", children: [(0, jsx_runtime_1.jsx)(react_2.Menu.Item, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/profile", className: "block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50", children: t('navigation.profile') }) }), (0, jsx_runtime_1.jsx)(react_2.Menu.Item, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/billing", className: "block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50", children: "Facturation" }) }), (0, jsx_runtime_1.jsx)(react_2.Menu.Item, { children: (0, jsx_runtime_1.jsx)("button", { className: "block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50 w-full text-left", onClick: handleSignOut, children: t('auth.logout') }) })] }) })] })] })] })] }), (0, jsx_runtime_1.jsx)("main", { className: "py-10", children: (0, jsx_runtime_1.jsx)("div", { className: "px-4 sm:px-6 lg:px-8", children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Outlet, {}) }) })] })] }));
}
