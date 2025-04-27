import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../stores/auth';
import { Footer } from '../Footer';
// Navigation pour les utilisateurs non connectés
const publicNavigation = [
    { name: 'Fonctionnalités', href: '/features' },
    { name: 'Comment ça marche', href: '/how-it-works' },
    { name: 'Tarifs', href: '/pricing' },
    { name: 'Témoignages', href: '/testimonials' },
];
const steps = [
    {
        id: '01',
        title: 'Créez votre profil',
        description: 'Importez votre CV ou créez-en un nouveau avec notre outil intuitif. Notre IA analysera vos compétences et votre expérience pour optimiser votre profil.',
        image: '/landing.jpg',
    },
    {
        id: '02',
        title: 'Recevez des suggestions personnalisées',
        description: 'Notre algorithme vous propose des offres d\'emploi correspondant à votre profil, avec un score de compatibilité pour chaque poste. Plus vous utilisez la plateforme, plus les suggestions deviennent pertinentes.',
        image: '/landing.jpg',
    },
    {
        id: '03',
        title: 'Optimisez vos candidatures',
        description: 'Notre IA analyse chaque offre d\'emploi et vous suggère des optimisations pour votre CV et lettre de motivation. Vous pouvez également utiliser notre outil de rédaction assistée pour créer des candidatures percutantes.',
        image: '/landing.jpg',
    },
    {
        id: '04',
        title: 'Postulez et suivez vos candidatures',
        description: 'Postulez directement depuis la plateforme et suivez l\'avancement de toutes vos candidatures dans un tableau de bord centralisé. Recevez des rappels automatiques pour les entretiens et les relances.',
        image: '/landing.jpg',
    },
    {
        id: '05',
        title: 'Développez votre réseau',
        description: 'Connectez-vous avec d\'autres professionnels, échangez des messages et développez votre réseau directement depuis la plateforme. Notre système de mise en relation vous suggère des contacts pertinents pour votre carrière.',
        image: '/landing.jpg',
    },
];
const faqs = [
    {
        question: 'Comment fonctionne l\'algorithme de matching ?',
        answer: 'Notre algorithme utilise l\'intelligence artificielle pour analyser votre profil (compétences, expérience, préférences) et le comparer aux offres d\'emploi disponibles. Il prend en compte plus de 50 critères différents pour calculer un score de compatibilité précis et vous proposer les offres les plus pertinentes.',
    },
    {
        question: 'Combien de temps faut-il pour créer un profil complet ?',
        answer: 'La création d\'un profil de base prend environ 5 minutes. Pour un profil complet avec toutes vos compétences, expériences et préférences, comptez environ 15-20 minutes. Vous pouvez également importer votre CV pour accélérer le processus.',
    },
    {
        question: 'Les recruteurs peuvent-ils me contacter directement ?',
        answer: 'Oui, si vous activez cette option dans vos paramètres de confidentialité. Vous gardez le contrôle total sur qui peut vous contacter et pouvez modifier ces paramètres à tout moment.',
    },
    {
        question: 'Comment l\'IA optimise-t-elle mon CV ?',
        answer: 'Notre IA analyse votre CV et le compare aux meilleures pratiques du secteur et aux exigences spécifiques de chaque offre d\'emploi. Elle vous suggère ensuite des améliorations pour mettre en valeur vos compétences pertinentes, utiliser les bons mots-clés et optimiser la structure pour les systèmes ATS des recruteurs.',
    },
    {
        question: 'Puis-je utiliser JobNexAI sur mobile ?',
        answer: 'Absolument ! JobNexAI est entièrement responsive et fonctionne parfaitement sur tous les appareils. Nous proposons également une application mobile pour iOS et Android pour une expérience encore plus fluide.',
    },
];
export function HowItWorksPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { t } = useTranslation();
    const { user } = useAuth();
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsxs("header", { className: "fixed inset-x-0 top-0 z-50 backdrop-blur-sm border-b border-white/10", children: [_jsxs("nav", { className: "flex items-center justify-between p-6 lg:px-8", "aria-label": "Global", children: [_jsx("div", { className: "flex lg:flex-1", children: _jsxs(Link, { to: "/", className: "-m-1.5 p-1.5", children: [_jsx("span", { className: "sr-only", children: "JobNexAI" }), _jsx("div", { className: "text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text", children: "JobNexAI" })] }) }), _jsx("div", { className: "flex lg:hidden", children: _jsxs("button", { type: "button", className: "-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white", onClick: () => setMobileMenuOpen(true), children: [_jsx("span", { className: "sr-only", children: "Open main menu" }), _jsx(Bars3Icon, { className: "h-6 w-6", "aria-hidden": "true" })] }) }), _jsx("div", { className: "hidden lg:flex lg:gap-x-12", children: publicNavigation.map((item) => (_jsx(Link, { to: item.href, className: "text-sm font-semibold leading-6 text-white hover:text-primary-400 transition-colors", children: item.name }, item.name))) }), _jsxs("div", { className: "hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-4", children: [_jsx(LanguageSwitcher, {}), !user && (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/login", className: "text-sm font-semibold px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-colors", children: t('auth.login') }), _jsx(Link, { to: "/pricing", className: "text-sm font-semibold px-3 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-500 hover:to-secondary-500 transition-colors", children: t('auth.startTrial') })] }))] })] }), _jsxs(Dialog, { as: "div", className: "lg:hidden", open: mobileMenuOpen, onClose: setMobileMenuOpen, children: [_jsx("div", { className: "fixed inset-0 z-50" }), _jsxs(Dialog.Panel, { className: "fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(Link, { to: "/", className: "-m-1.5 p-1.5", children: [_jsx("span", { className: "sr-only", children: "JobNexAI" }), _jsx("div", { className: "text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text", children: "JobNexAI" })] }), _jsxs("button", { type: "button", className: "-m-2.5 rounded-md p-2.5 text-white", onClick: () => setMobileMenuOpen(false), children: [_jsx("span", { className: "sr-only", children: "Close menu" }), _jsx(XMarkIcon, { className: "h-6 w-6", "aria-hidden": "true" })] })] }), _jsx("div", { className: "mt-6 flow-root", children: _jsxs("div", { className: "-my-6 divide-y divide-white/10", children: [_jsx("div", { className: "space-y-2 py-6", children: publicNavigation.map((item) => (_jsx(Link, { to: item.href, className: "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-white/10", onClick: () => setMobileMenuOpen(false), children: item.name }, item.name))) }), _jsxs("div", { className: "py-6", children: [_jsx("div", { className: "mb-4", children: _jsx(LanguageSwitcher, {}) }), !user && (_jsxs("div", { className: "space-y-4", children: [_jsx(Link, { to: "/login", className: "block text-center text-sm font-semibold px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-colors", children: t('auth.login') }), _jsx(Link, { to: "/pricing", className: "block text-center text-sm font-semibold px-3 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-500 hover:to-secondary-500 transition-colors", children: t('auth.startTrial') })] }))] })] }) })] })] })] }), _jsxs("main", { children: [_jsxs("div", { className: "relative isolate pt-24", children: [_jsx("div", { className: "absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80", "aria-hidden": "true", children: _jsx("div", { className: "relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-600 to-secondary-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]", style: {
                                        clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                                    } }) }), _jsx("div", { className: "py-24 sm:py-32", children: _jsx("div", { className: "mx-auto max-w-7xl px-6 lg:px-8", children: _jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [_jsx(motion.h1, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text", children: "Comment \u00E7a marche" }), _jsx(motion.p, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.2 }, className: "mt-6 text-lg leading-8 text-gray-300", children: "D\u00E9couvrez comment JobNexAI transforme votre recherche d'emploi en un processus simple, efficace et personnalis\u00E9 gr\u00E2ce \u00E0 l'intelligence artificielle." })] }) }) })] }), _jsx("div", { className: "bg-white/5", children: _jsxs("div", { className: "mx-auto max-w-7xl px-6 lg:px-8", children: [_jsxs("div", { className: "mx-auto max-w-2xl lg:text-center", children: [_jsx("h2", { className: "text-base font-semibold leading-7 text-primary-400", children: "Processus simplifi\u00E9" }), _jsx("p", { className: "mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl", children: "Trouvez votre emploi id\u00E9al en 5 \u00E9tapes" }), _jsx("p", { className: "mt-6 text-lg leading-8 text-gray-300", children: "Notre plateforme simplifie votre recherche d'emploi gr\u00E2ce \u00E0 l'intelligence artificielle et des outils intuitifs." })] }), _jsx("div", { className: "mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none", children: steps.map((step, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: index * 0.1 }, className: `relative pb-12 ${index === steps.length - 1 ? '' : 'border-l border-white/20'} pl-12`, children: [_jsx("div", { className: "absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 -translate-x-1/2 text-white font-bold", children: step.id }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 items-center", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold text-white mb-4", children: step.title }), _jsx("p", { className: "text-gray-400", children: step.description })] }), _jsx("div", { className: "rounded-xl overflow-hidden shadow-xl", children: _jsx("img", { src: step.image, alt: step.title, className: "w-full h-auto" }) })] })] }, step.id))) })] }) }), _jsx("div", { className: "py-24 sm:py-32", children: _jsxs("div", { className: "mx-auto max-w-7xl px-6 lg:px-8", children: [_jsxs("div", { className: "mx-auto max-w-2xl lg:text-center", children: [_jsx("h2", { className: "text-base font-semibold leading-7 text-primary-400", children: "Voir en action" }), _jsx("p", { className: "mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl", children: "D\u00E9couvrez JobNexAI en vid\u00E9o" }), _jsx("p", { className: "mt-6 text-lg leading-8 text-gray-300", children: "Une d\u00E9monstration vaut mieux que mille mots. Regardez comment JobNexAI peut transformer votre recherche d'emploi." })] }), _jsx("div", { className: "mx-auto mt-16 max-w-4xl", children: _jsx("div", { className: "aspect-video rounded-xl overflow-hidden bg-white/5 flex items-center justify-center", children: _jsxs("div", { className: "text-center p-8", children: [_jsx("p", { className: "text-gray-400 mb-4", children: "Vid\u00E9o de d\u00E9monstration" }), _jsx("button", { className: "btn-primary", children: "Regarder la d\u00E9mo" })] }) }) })] }) }), _jsx("div", { className: "bg-white/5 py-24 sm:py-32", children: _jsxs("div", { className: "mx-auto max-w-7xl px-6 lg:px-8", children: [_jsxs("div", { className: "mx-auto max-w-2xl lg:text-center", children: [_jsx("h2", { className: "text-base font-semibold leading-7 text-primary-400", children: "Questions fr\u00E9quentes" }), _jsx("p", { className: "mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl", children: "Tout ce que vous devez savoir" }), _jsx("p", { className: "mt-6 text-lg leading-8 text-gray-300", children: "Vous avez des questions ? Nous avons les r\u00E9ponses. Voici les questions les plus fr\u00E9quemment pos\u00E9es sur JobNexAI." })] }), _jsx("div", { className: "mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl", children: _jsx("dl", { className: "space-y-8", children: faqs.map((faq, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.1 * index }, className: "bg-white/10 p-8 rounded-xl", children: [_jsx("dt", { className: "text-lg font-semibold text-white mb-4", children: faq.question }), _jsx("dd", { className: "text-gray-400", children: faq.answer })] }, index))) }) })] }) }), _jsxs("div", { className: "relative isolate mt-32 px-6 py-32 sm:mt-56 sm:py-40 lg:px-8", children: [_jsx("div", { className: "absolute inset-0 -z-10 overflow-hidden", children: _jsx("div", { className: "absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 bg-gradient-to-tr from-primary-600 to-secondary-600 opacity-10 sm:left-[calc(50%-40rem)]" }) }), _jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [_jsx("h2", { className: "text-3xl font-bold tracking-tight text-white sm:text-4xl", children: "Pr\u00EAt \u00E0 commencer votre nouvelle aventure professionnelle ?" }), _jsx("p", { className: "mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300", children: "Rejoignez des milliers de professionnels qui ont d\u00E9j\u00E0 transform\u00E9 leur recherche d'emploi avec JobNexAI." }), _jsxs("div", { className: "mt-10 flex items-center justify-center gap-x-6", children: [_jsx("a", { href: "/pricing", className: "btn-primary", children: "Commencer gratuitement" }), _jsxs("a", { href: "/login", className: "text-sm font-semibold leading-6 text-white", children: ["Se connecter ", _jsx("span", { "aria-hidden": "true", children: "\u2192" })] })] })] })] })] }), _jsx(Footer, {})] }));
}
