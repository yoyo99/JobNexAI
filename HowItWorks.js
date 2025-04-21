"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HowItWorks = HowItWorks;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const steps = [
    {
        title: "Créez votre profil",
        description: "Importez votre CV ou créez-en un nouveau avec notre outil intuitif. Notre IA analysera vos compétences et votre expérience.",
        icon: "1",
    },
    {
        title: "Recevez des suggestions personnalisées",
        description: "Notre algorithme vous propose des offres d'emploi correspondant à votre profil, avec un score de compatibilité pour chaque poste.",
        icon: "2",
    },
    {
        title: "Postulez et suivez vos candidatures",
        description: "Postulez directement depuis la plateforme et suivez l'avancement de toutes vos candidatures dans un tableau de bord centralisé.",
        icon: "3",
    },
];
function HowItWorks() {
    return ((0, jsx_runtime_1.jsx)("div", { className: "bg-white/5 py-24 sm:py-32", id: "how-it-works", children: (0, jsx_runtime_1.jsxs)("div", { className: "mx-auto max-w-7xl px-6 lg:px-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mx-auto max-w-2xl lg:text-center", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-base font-semibold leading-7 text-primary-400", children: "Comment \u00E7a marche" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl", children: "Trouvez votre emploi id\u00E9al en 3 \u00E9tapes simples" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-6 text-lg leading-8 text-gray-300", children: "Notre plateforme simplifie votre recherche d'emploi gr\u00E2ce \u00E0 l'intelligence artificielle et des outils intuitifs." })] }), (0, jsx_runtime_1.jsx)("div", { className: "mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl", children: (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 gap-12 lg:grid-cols-3", children: steps.map((step, index) => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.1 * index }, className: "relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white text-xl font-bold", children: step.icon }), (0, jsx_runtime_1.jsx)("h3", { className: "mt-6 text-lg font-semibold leading-8 text-white", children: step.title }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-base leading-7 text-gray-400", children: step.description })] }, index))) }) })] }) }));
}
