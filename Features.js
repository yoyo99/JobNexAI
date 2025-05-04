"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Features = Features;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const outline_1 = require("@heroicons/react/24/outline");
const features = [
    {
        name: 'Recherche d\'emploi intelligente',
        description: 'Notre algorithme d\'IA analyse votre profil et les offres disponibles pour vous proposer les emplois les plus pertinents avec un score de compatibilité.',
        icon: outline_1.MagnifyingGlassIcon,
    },
    {
        name: 'CV builder professionnel',
        description: 'Créez un CV professionnel optimisé pour les ATS avec nos modèles élégants et nos conseils d\'amélioration personnalisés.',
        icon: outline_1.DocumentTextIcon,
    },
    {
        name: 'Suivi des candidatures',
        description: 'Suivez toutes vos candidatures en un seul endroit, avec des rappels automatiques pour les entretiens et les relances.',
        icon: outline_1.BriefcaseIcon,
    },
    {
        name: 'Analyses de marché',
        description: 'Accédez à des données en temps réel sur les salaires, les compétences recherchées et les tendances du marché de l\'emploi.',
        icon: outline_1.ChartBarIcon,
    },
    {
        name: 'Suggestions personnalisées',
        description: 'Recevez des suggestions d\'emploi personnalisées basées sur vos compétences, votre expérience et vos préférences.',
        icon: outline_1.BoltIcon,
    },
    {
        name: 'Réseau professionnel',
        description: 'Connectez-vous avec d\'autres professionnels, échangez des messages et développez votre réseau directement depuis la plateforme.',
        icon: outline_1.UserGroupIcon,
    },
];
function Features() {
    return ((0, jsx_runtime_1.jsx)("div", { className: "py-24 sm:py-32", id: "features", children: (0, jsx_runtime_1.jsxs)("div", { className: "mx-auto max-w-7xl px-6 lg:px-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mx-auto max-w-2xl lg:text-center", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-base font-semibold leading-7 text-primary-400", children: "Optimisez votre recherche" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl", children: "Tout ce dont vous avez besoin pour trouver le job id\u00E9al" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-6 text-lg leading-8 text-gray-300", children: "JobNexAI combine intelligence artificielle et outils professionnels pour vous aider \u00E0 d\u00E9crocher votre prochain emploi plus rapidement et plus efficacement." })] }), (0, jsx_runtime_1.jsx)("div", { className: "mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl", children: (0, jsx_runtime_1.jsx)("dl", { className: "grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16", children: features.map((feature, index) => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.1 * index }, className: "relative pl-16", children: [(0, jsx_runtime_1.jsxs)("dt", { className: "text-base font-semibold leading-7 text-white", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600", children: (0, jsx_runtime_1.jsx)(feature.icon, { className: "h-6 w-6 text-white", "aria-hidden": "true" }) }), feature.name] }), (0, jsx_runtime_1.jsx)("dd", { className: "mt-2 text-base leading-7 text-gray-400", children: feature.description })] }, feature.name))) }) })] }) }));
}
