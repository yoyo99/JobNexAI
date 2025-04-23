import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { VideoModal } from './VideoModal';
import { PlayCircleIcon, CheckIcon } from '@heroicons/react/24/outline';
const features = [
    'Recherche d\'emploi intelligente avec IA',
    'CV builder professionnel',
    'Suivi des candidatures automatisé',
    'Analyses de marché en temps réel',
    'Suggestions d\'emploi personnalisées',
    'Réseau professionnel intégré',
];
function getFeatureDescription(index) {
    const descriptions = [
        "Notre algorithme d'IA analyse votre profil et les offres disponibles pour vous proposer les emplois les plus pertinents avec un score de compatibilité.",
        "Créez un CV professionnel optimisé pour les ATS avec nos modèles élégants et nos conseils d'amélioration personnalisés.",
        "Suivez toutes vos candidatures en un seul endroit, avec des rappels automatiques pour les entretiens et les relances.",
        "Accédez à des données en temps réel sur les salaires, les compétences recherchées et les tendances du marché de l'emploi.",
        "Recevez des suggestions d'emploi personnalisées basées sur vos compétences, votre expérience et vos préférences.",
        "Connectez-vous avec d'autres professionnels, échangez des messages et développez votre réseau directement depuis la plateforme."
    ];
    return descriptions[index] || '';
}
export function Hero() {
    const { t } = useTranslation();
    const [showVideo, setShowVideo] = useState(false);
    return (_jsxs("div", { className: "relative isolate pt-14", children: [_jsx("div", { className: "absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80", "aria-hidden": "true", children: _jsx("div", { className: "relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-600 to-secondary-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]", style: {
                        clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    } }) }), _jsx("div", { className: "py-24 sm:py-32 lg:pb-40", children: _jsxs("div", { className: "mx-auto max-w-7xl px-6 lg:px-8", children: [_jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [_jsx(motion.h1, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text", children: "La plateforme tout-en-un pour l'emploi" }), _jsx(motion.p, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.2 }, className: "mt-6 text-lg leading-8 text-gray-300", children: "JobNexus connecte candidats, freelances et recruteurs gr\u00E2ce \u00E0 l'IA. Trouvez le job id\u00E9al, d\u00E9crochez des missions ou recrutez les meilleurs talents en toute simplicit\u00E9." }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.4 }, className: "mt-10 flex items-center justify-center gap-x-6", children: [_jsx(Link, { to: "/pricing", className: "btn-primary", children: t('hero.startTrial') }), _jsxs("button", { onClick: () => setShowVideo(true), className: "btn-secondary inline-flex items-center gap-2", children: [_jsx(PlayCircleIcon, { className: "h-5 w-5" }), t('hero.watchDemo')] })] })] }), _jsx(motion.div, { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.6 }, className: "mt-16 flow-root sm:mt-24", children: _jsx("div", { className: "rounded-xl bg-white/5 p-2 ring-1 ring-inset ring-white/10 lg:rounded-2xl", children: _jsx("img", { src: "/landing.jpg", alt: "Homme en costume travaillant sur un ordinateur avec une interface futuriste", className: "rounded-md shadow-2xl ring-1 ring-white/10 w-full h-auto" }) }) })] }) }), _jsxs("div", { className: "mx-auto max-w-7xl px-6 lg:px-8 pb-24", id: "features", children: [_jsxs("div", { className: "mx-auto max-w-2xl lg:text-center", children: [_jsx("h2", { className: "text-base font-semibold leading-7 text-primary-400", children: "Optimisez votre recherche" }), _jsx("p", { className: "mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl", children: "Tout ce dont vous avez besoin pour trouver le job id\u00E9al" }), _jsx("p", { className: "mt-6 text-lg leading-8 text-gray-300", children: "JobNexus combine intelligence artificielle et outils professionnels pour vous aider \u00E0 d\u00E9crocher votre prochain emploi plus rapidement et plus efficacement." })] }), _jsx("div", { className: "mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl", children: _jsx("dl", { className: "grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16", children: features.map((feature, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.1 * index }, className: "relative pl-16", children: [_jsxs("dt", { className: "text-base font-semibold leading-7 text-white", children: [_jsx("div", { className: "absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600", children: _jsx(CheckIcon, { className: "h-6 w-6 text-white", "aria-hidden": "true" }) }), feature] }), _jsx("dd", { className: "mt-2 text-base leading-7 text-gray-400", children: getFeatureDescription(index) })] }, index))) }) })] }), _jsx("div", { className: "bg-white/5 py-24 sm:py-32", id: "how-it-works", children: _jsxs("div", { className: "mx-auto max-w-7xl px-6 lg:px-8", children: [_jsxs("div", { className: "mx-auto max-w-2xl lg:text-center", children: [_jsx("h2", { className: "text-base font-semibold leading-7 text-primary-400", children: "Comment \u00E7a marche" }), _jsx("p", { className: "mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl", children: "Trouvez votre emploi id\u00E9al en 3 \u00E9tapes simples" }), _jsx("p", { className: "mt-6 text-lg leading-8 text-gray-300", children: "Notre plateforme simplifie votre recherche d'emploi gr\u00E2ce \u00E0 l'intelligence artificielle et des outils intuitifs." })] }), _jsx("div", { className: "mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl", children: _jsx("div", { className: "grid grid-cols-1 gap-12 lg:grid-cols-3", children: steps.map((step, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.1 * index }, className: "relative", children: [_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white text-xl font-bold", children: index + 1 }), _jsx("h3", { className: "mt-6 text-lg font-semibold leading-8 text-white", children: step.title }), _jsx("p", { className: "mt-2 text-base leading-7 text-gray-400", children: step.description })] }, index))) }) })] }) }), _jsx("div", { className: "bg-white/5 py-24 sm:py-32", id: "about", children: _jsxs("div", { className: "mx-auto max-w-7xl px-6 lg:px-8", children: [_jsxs("div", { className: "mx-auto max-w-xl text-center", children: [_jsx("h2", { className: "text-lg font-semibold leading-8 tracking-tight text-primary-400", children: "T\u00E9moignages" }), _jsx("p", { className: "mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl", children: "Ils ont trouv\u00E9 leur emploi id\u00E9al avec JobNexus" })] }), _jsx("div", { className: "mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none", children: _jsx("div", { className: "-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3", children: testimonials.map((testimonial, index) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.1 * index }, className: "pt-8 sm:inline-block sm:w-full sm:px-4", children: _jsxs("figure", { className: "rounded-2xl bg-white/5 p-8 text-sm leading-6", children: [_jsx("blockquote", { className: "text-white", children: _jsx("p", { children: `"${testimonial.quote}"` }) }), _jsxs("figcaption", { className: "mt-6 flex items-center gap-x-4", children: [_jsx("div", { className: "h-10 w-10 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center text-white font-semibold", children: testimonial.name[0] }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold text-white", children: testimonial.name }), _jsx("div", { className: "text-gray-400", children: testimonial.role })] })] })] }) }, index))) }) })] }) }), _jsxs("div", { className: "relative isolate mt-32 px-6 py-32 sm:mt-56 sm:py-40 lg:px-8", children: [_jsx("div", { className: "absolute inset-0 -z-10 overflow-hidden", children: _jsx("div", { className: "absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 bg-gradient-to-tr from-primary-600 to-secondary-600 opacity-10 sm:left-[calc(50%-40rem)]" }) }), _jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [_jsx("h2", { className: "text-3xl font-bold tracking-tight text-white sm:text-4xl", children: "Pr\u00EAt \u00E0 booster votre carri\u00E8re ?" }), _jsx("p", { className: "mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300", children: "Rejoignez des milliers de professionnels qui ont d\u00E9j\u00E0 transform\u00E9 leur recherche d'emploi avec JobNexus." }), _jsxs("div", { className: "mt-10 flex items-center justify-center gap-x-6", children: [_jsx(Link, { to: "/pricing", className: "btn-primary", children: "Commencer gratuitement" }), _jsxs(Link, { to: "/login", className: "text-sm font-semibold leading-6 text-white", children: ["Se connecter ", _jsx("span", { "aria-hidden": "true", children: "\u2192" })] })] })] })] }), _jsx(VideoModal, { isOpen: showVideo, onClose: () => setShowVideo(false) })] }));
}
const testimonials = [
    {
        name: 'Sophie Martin',
        role: 'Développeuse Full Stack',
        quote: 'Grâce à JobNexus, j\'ai trouvé un poste qui correspond parfaitement à mes compétences en seulement 3 semaines. L\'outil d\'analyse de CV m\'a permis d\'optimiser mon profil pour chaque candidature.',
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
const steps = [
    {
        title: "Créez votre profil",
        description: "Importez votre CV ou créez-en un nouveau avec notre outil intuitif. Notre IA analysera vos compétences et votre expérience."
    },
    {
        title: "Recevez des suggestions personnalisées",
        description: "Notre algorithme vous propose des offres d'emploi correspondant à votre profil, avec un score de compatibilité pour chaque poste."
    },
    {
        title: "Postulez et suivez vos candidatures",
        description: "Postulez directement depuis la plateforme et suivez l'avancement de toutes vos candidatures dans un tableau de bord centralisé."
    }
];
