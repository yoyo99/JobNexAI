"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeaturesPage = FeaturesPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const react_1 = require("react");
const react_2 = require("@headlessui/react");
const outline_1 = require("@heroicons/react/24/outline");
const react_router_dom_1 = require("react-router-dom");
const LanguageSwitcher_1 = require("../LanguageSwitcher");
const react_i18next_1 = require("react-i18next");
const auth_1 = require("../../stores/auth");
const Footer_1 = require("../Footer");
const outline_2 = require("@heroicons/react/24/outline");
// Navigation pour les utilisateurs non connectés
const publicNavigation = [
    { name: 'Fonctionnalités', href: '/features' },
    { name: 'Comment ça marche', href: '/how-it-works' },
    { name: 'Tarifs', href: '/pricing' },
    { name: 'Témoignages', href: '/testimonials' },
];
const features = [
    {
        name: 'Recherche d\'emploi intelligente',
        description: 'Notre algorithme d\'IA analyse votre profil et les offres disponibles pour vous proposer les emplois les plus pertinents avec un score de compatibilité.',
        icon: outline_2.MagnifyingGlassIcon,
        color: 'from-pink-500 to-purple-500',
    },
    {
        name: 'CV builder professionnel',
        description: 'Créez un CV professionnel optimisé pour les ATS avec nos modèles élégants et nos conseils d\'amélioration personnalisés.',
        icon: outline_2.DocumentTextIcon,
        color: 'from-purple-500 to-indigo-500',
    },
    {
        name: 'Suivi des candidatures',
        description: 'Suivez toutes vos candidatures en un seul endroit, avec des rappels automatiques pour les entretiens et les relances.',
        icon: outline_2.BriefcaseIcon,
        color: 'from-indigo-500 to-blue-500',
    },
    {
        name: 'Analyses de marché',
        description: 'Accédez à des données en temps réel sur les salaires, les compétences recherchées et les tendances du marché de l\'emploi.',
        icon: outline_2.ChartBarIcon,
        color: 'from-blue-500 to-teal-500',
    },
    {
        name: 'Suggestions personnalisées',
        description: 'Recevez des suggestions d\'emploi personnalisées basées sur vos compétences, votre expérience et vos préférences.',
        icon: outline_2.BoltIcon,
        color: 'from-teal-500 to-green-500',
    },
    {
        name: 'Réseau professionnel',
        description: 'Connectez-vous avec d\'autres professionnels, échangez des messages et développez votre réseau directement depuis la plateforme.',
        icon: outline_2.UserGroupIcon,
        color: 'from-green-500 to-yellow-500',
    },
    {
        name: 'Alertes emploi en temps réel',
        description: 'Soyez informé dès qu\'une nouvelle offre correspondant à vos critères est publiée, par email ou notification push.',
        icon: outline_2.RocketLaunchIcon,
        color: 'from-yellow-500 to-orange-500',
    },
    {
        name: 'Optimisation IA de candidature',
        description: 'Notre IA analyse chaque offre d\'emploi et vous suggère des optimisations pour votre CV et lettre de motivation afin de maximiser vos chances.',
        icon: outline_2.LightBulbIcon,
        color: 'from-orange-500 to-red-500',
    },
    {
        name: 'Protection des données',
        description: 'Vos données sont sécurisées et protégées selon les normes RGPD les plus strictes, avec un contrôle total sur vos informations personnelles.',
        icon: outline_2.ShieldCheckIcon,
        color: 'from-red-500 to-pink-500',
    },
    {
        name: 'Automatisation des tâches',
        description: 'Automatisez les tâches répétitives de votre recherche d\'emploi comme les relances, les suivis et les mises à jour de statut.',
        icon: outline_2.ClockIcon,
        color: 'from-pink-500 to-purple-500',
    },
    {
        name: 'Intégration IA avancée',
        description: 'Notre plateforme utilise les dernières avancées en intelligence artificielle pour vous offrir une expérience personnalisée et efficace.',
        icon: outline_2.CpuChipIcon,
        color: 'from-purple-500 to-indigo-500',
    },
    {
        name: 'Multilingue et international',
        description: 'JobNexAI est disponible en plusieurs langues et couvre les offres d\'emploi dans de nombreux pays pour une recherche sans frontières.',
        icon: outline_2.GlobeAltIcon,
        color: 'from-indigo-500 to-blue-500',
    },
];
function FeaturesPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = (0, react_1.useState)(false);
    const { t } = (0, react_i18next_1.useTranslation)();
    const { user } = (0, auth_1.useAuth)();
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-background", children: [(0, jsx_runtime_1.jsxs)("header", { className: "fixed inset-x-0 top-0 z-50 backdrop-blur-sm border-b border-white/10", children: [(0, jsx_runtime_1.jsxs)("nav", { className: "flex items-center justify-between p-6 lg:px-8", "aria-label": "Global", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex lg:flex-1", children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/", className: "-m-1.5 p-1.5", children: [(0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: "JobNexAI" }), (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text", children: "JobNexAI" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex lg:hidden", children: (0, jsx_runtime_1.jsxs)("button", { type: "button", className: "-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white", onClick: () => setMobileMenuOpen(true), children: [(0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: "Open main menu" }), (0, jsx_runtime_1.jsx)(outline_1.Bars3Icon, { className: "h-6 w-6", "aria-hidden": "true" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "hidden lg:flex lg:gap-x-12", children: publicNavigation.map((item) => ((0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: item.href, className: "text-sm font-semibold leading-6 text-white hover:text-primary-400 transition-colors", children: item.name }, item.name))) }), (0, jsx_runtime_1.jsxs)("div", { className: "hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-4", children: [(0, jsx_runtime_1.jsx)(LanguageSwitcher_1.LanguageSwitcher, {}), !user && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/login", className: "text-sm font-semibold px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-colors", children: t('auth.login') }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/pricing", className: "text-sm font-semibold px-3 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-500 hover:to-secondary-500 transition-colors", children: t('auth.startTrial') })] }))] })] }), (0, jsx_runtime_1.jsxs)(react_2.Dialog, { as: "div", className: "lg:hidden", open: mobileMenuOpen, onClose: setMobileMenuOpen, children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 z-50" }), (0, jsx_runtime_1.jsxs)(react_2.Dialog.Panel, { className: "fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_router_dom_1.Link, { to: "/", className: "-m-1.5 p-1.5", children: [(0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: "JobNexAI" }), (0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text", children: "JobNexAI" })] }), (0, jsx_runtime_1.jsxs)("button", { type: "button", className: "-m-2.5 rounded-md p-2.5 text-white", onClick: () => setMobileMenuOpen(false), children: [(0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: "Close menu" }), (0, jsx_runtime_1.jsx)(outline_1.XMarkIcon, { className: "h-6 w-6", "aria-hidden": "true" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-6 flow-root", children: (0, jsx_runtime_1.jsxs)("div", { className: "-my-6 divide-y divide-white/10", children: [(0, jsx_runtime_1.jsx)("div", { className: "space-y-2 py-6", children: publicNavigation.map((item) => ((0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: item.href, className: "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-white/10", onClick: () => setMobileMenuOpen(false), children: item.name }, item.name))) }), (0, jsx_runtime_1.jsxs)("div", { className: "py-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-4", children: (0, jsx_runtime_1.jsx)(LanguageSwitcher_1.LanguageSwitcher, {}) }), !user && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/login", className: "block text-center text-sm font-semibold px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-colors", children: t('auth.login') }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/pricing", className: "block text-center text-sm font-semibold px-3 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-500 hover:to-secondary-500 transition-colors", children: t('auth.startTrial') })] }))] })] }) })] })] })] }), (0, jsx_runtime_1.jsxs)("main", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative isolate pt-24", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80", "aria-hidden": "true", children: (0, jsx_runtime_1.jsx)("div", { className: "relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-600 to-secondary-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]", style: {
                                        clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                                    } }) }), (0, jsx_runtime_1.jsx)("div", { className: "py-24 sm:py-32", children: (0, jsx_runtime_1.jsx)("div", { className: "mx-auto max-w-7xl px-6 lg:px-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "mx-auto max-w-2xl text-center", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.h1, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text", children: "Fonctionnalit\u00E9s" }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.p, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.2 }, className: "mt-6 text-lg leading-8 text-gray-300", children: "D\u00E9couvrez toutes les fonctionnalit\u00E9s innovantes de JobNexAI qui transforment votre recherche d'emploi en une exp\u00E9rience efficace, personnalis\u00E9e et sans stress." })] }) }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "py-24 sm:py-32 bg-white/5", children: (0, jsx_runtime_1.jsxs)("div", { className: "mx-auto max-w-7xl px-6 lg:px-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mx-auto max-w-2xl lg:text-center", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-base font-semibold leading-7 text-primary-400", children: "Optimisez votre recherche" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl", children: "Tout ce dont vous avez besoin pour trouver le job id\u00E9al" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-6 text-lg leading-8 text-gray-300", children: "JobNexAI combine intelligence artificielle et outils professionnels pour vous aider \u00E0 d\u00E9crocher votre prochain emploi plus rapidement et plus efficacement." })] }), (0, jsx_runtime_1.jsx)("div", { className: "mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none", children: (0, jsx_runtime_1.jsx)("dl", { className: "grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3", children: features.map((feature, index) => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.1 * index }, className: "flex flex-col", children: [(0, jsx_runtime_1.jsxs)("dt", { className: "text-base font-semibold leading-7 text-white", children: [(0, jsx_runtime_1.jsx)("div", { className: `mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r ${feature.color}`, children: (0, jsx_runtime_1.jsx)(feature.icon, { className: "h-6 w-6 text-white", "aria-hidden": "true" }) }), feature.name] }), (0, jsx_runtime_1.jsx)("dd", { className: "mt-1 flex flex-auto flex-col text-base leading-7 text-gray-400", children: (0, jsx_runtime_1.jsx)("p", { className: "flex-auto", children: feature.description }) })] }, feature.name))) }) })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "relative isolate mt-32 px-6 py-32 sm:mt-56 sm:py-40 lg:px-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 -z-10 overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: "absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 bg-gradient-to-tr from-primary-600 to-secondary-600 opacity-10 sm:left-[calc(50%-40rem)]" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "mx-auto max-w-2xl text-center", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-bold tracking-tight text-white sm:text-4xl", children: "Pr\u00EAt \u00E0 booster votre carri\u00E8re ?" }), (0, jsx_runtime_1.jsx)("p", { className: "mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300", children: "Rejoignez des milliers de professionnels qui ont d\u00E9j\u00E0 transform\u00E9 leur recherche d'emploi avec JobNexAI." }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-10 flex items-center justify-center gap-x-6", children: [(0, jsx_runtime_1.jsx)("a", { href: "/pricing", className: "btn-primary", children: "Commencer gratuitement" }), (0, jsx_runtime_1.jsxs)("a", { href: "/login", className: "text-sm font-semibold leading-6 text-white", children: ["Se connecter ", (0, jsx_runtime_1.jsx)("span", { "aria-hidden": "true", children: "\u2192" })] })] })] })] })] }), (0, jsx_runtime_1.jsx)(Footer_1.Footer, {})] }));
}
