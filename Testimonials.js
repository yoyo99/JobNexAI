"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Testimonials = Testimonials;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const testimonials = [
    {
        name: 'Sophie Martin',
        role: 'Développeuse Full Stack',
        quote: 'Grâce à JobNexAI, j\'ai trouvé un poste qui correspond parfaitement à mes compétences en seulement 3 semaines. L\'outil d\'analyse de CV m\'a permis d\'optimiser mon profil pour chaque candidature.',
    },
    {
        name: 'Thomas Dubois',
        role: 'Product Manager',
        quote: 'Le système de matching intelligent m\'a fait gagner un temps précieux. J\'ai reçu des alertes pour des offres qui correspondaient vraiment à mes critères, et j\'ai décroché un job avec un salaire 15% supérieur à mon précédent poste.',
    },
    {
        name: 'Léa Bernard',
        role: 'UX Designer',
        quote: 'Le suivi des candidatures est incroyablement pratique. Je pouvais voir en un coup d\'œil où j\'en étais dans mes démarches, et les rappels automatiques m\'ont évité d\'oublier des entretiens importants.',
    },
    {
        name: 'Alexandre Petit',
        role: 'Data Scientist',
        quote: 'Les analyses de marché m\'ont donné un avantage considérable lors des négociations salariales. J\'ai pu me positionner avec confiance en connaissant les tendances du secteur.',
    },
    {
        name: 'Julie Moreau',
        role: 'Chef de projet',
        quote: 'Le réseau professionnel intégré m\'a permis de rentrer en contact avec des recruteurs directement. C\'est comme ça que j\'ai obtenu mon poste actuel, sans même passer par une annonce classique.',
    },
    {
        name: 'Nicolas Lambert',
        role: 'Ingénieur DevOps',
        quote: 'L\'abonnement Pro vaut vraiment son prix. Les fonctionnalités avancées m\'ont permis de me démarquer et de décrocher plusieurs entretiens dans des entreprises très recherchées.',
    },
];
function Testimonials() {
    return ((0, jsx_runtime_1.jsx)("div", { className: "bg-white/5 py-24 sm:py-32", id: "testimonials", children: (0, jsx_runtime_1.jsxs)("div", { className: "mx-auto max-w-7xl px-6 lg:px-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mx-auto max-w-xl text-center", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold leading-8 tracking-tight text-primary-400", children: "T\u00E9moignages" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl", children: "Ils ont trouv\u00E9 leur emploi id\u00E9al avec JobNexAI" })] }), (0, jsx_runtime_1.jsx)("div", { className: "mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none", children: (0, jsx_runtime_1.jsx)("div", { className: "-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3", children: testimonials.map((testimonial, index) => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.1 * index }, className: "pt-8 sm:inline-block sm:w-full sm:px-4", children: (0, jsx_runtime_1.jsxs)("figure", { className: "rounded-2xl bg-white/5 p-8 text-sm leading-6", children: [(0, jsx_runtime_1.jsx)("blockquote", { className: "text-white", children: (0, jsx_runtime_1.jsx)("p", { children: `"${testimonial.quote}"` }) }), (0, jsx_runtime_1.jsxs)("figcaption", { className: "mt-6 flex items-center gap-x-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-10 w-10 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center text-white font-semibold", children: testimonial.name[0] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold text-white", children: testimonial.name }), (0, jsx_runtime_1.jsx)("div", { className: "text-gray-400", children: testimonial.role })] })] })] }) }, index))) }) })] }) }));
}
