import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../stores/auth';
import { Footer } from '../Footer';
import { StarIcon } from '@heroicons/react/24/solid';
// Navigation pour les utilisateurs non connectés
const publicNavigation = [
    { name: 'Fonctionnalités', href: '/features' },
    { name: 'Comment ça marche', href: '/how-it-works' },
    { name: 'Tarifs', href: '/pricing' },
    { name: 'Témoignages', href: '/testimonials' },
];
const testimonials = [
    {
        name: 'Sophie Martin',
        role: 'Développeuse Full Stack',
        company: 'TechInnovate',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        quote: 'Grâce à JobNexus, j\'ai trouvé un poste qui correspond parfaitement à mes compétences en seulement 3 semaines. L\'outil d\'analyse de CV m\'a permis d\'optimiser mon profil pour chaque candidature et le système de matching m\'a fait gagner un temps précieux.',
        rating: 5,
    },
    {
        name: 'Thomas Dubois',
        role: 'Product Manager',
        company: 'InnovateSoft',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        quote: 'Le système de matching intelligent m\'a fait gagner un temps précieux. J\'ai reçu des alertes pour des offres qui correspondaient vraiment à mes critères, et j\'ai décroché un job avec un salaire 15% supérieur à mon précédent poste. Je recommande vivement !',
        rating: 5,
    },
    {
        name: 'Léa Bernard',
        role: 'UX Designer',
        company: 'DesignHub',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        quote: 'Le suivi des candidatures est incroyablement pratique. Je pouvais voir en un coup d\'œil où j\'en étais dans mes démarches, et les rappels automatiques m\'ont évité d\'oublier des entretiens importants. L\'interface est intuitive et agréable à utiliser.',
        rating: 4,
    },
    {
        name: 'Alexandre Petit',
        role: 'Data Scientist',
        company: 'DataInsight',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        quote: 'Les analyses de marché m\'ont donné un avantage considérable lors des négociations salariales. J\'ai pu me positionner avec confiance en connaissant les tendances du secteur. L\'outil d\'analyse de CV pourrait être encore plus détaillé, mais dans l\'ensemble, c\'est excellent.',
        rating: 4,
    },
    {
        name: 'Julie Moreau',
        role: 'Chef de projet',
        company: 'ProjectLead',
        image: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        quote: 'Le réseau professionnel intégré m\'a permis de rentrer en contact avec des recruteurs directement. C\'est comme ça que j\'ai obtenu mon poste actuel, sans même passer par une annonce classique. JobNexus a complètement transformé ma façon de chercher du travail.',
        rating: 5,
    },
    {
        name: 'Nicolas Lambert',
        role: 'Ingénieur DevOps',
        company: 'CloudTech',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        quote: 'L\'abonnement Pro vaut vraiment son prix. Les fonctionnalités avancées m\'ont permis de me démarquer et de décrocher plusieurs entretiens dans des entreprises très recherchées. Le retour sur investissement a été immédiat.',
        rating: 5,
    },
];
const recruiterTestimonials = [
    {
        name: 'Marie Durand',
        role: 'Directrice des Ressources Humaines',
        company: 'TechGlobal',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        quote: 'JobNexus nous a permis de trouver des candidats de qualité beaucoup plus rapidement qu\'avec les méthodes traditionnelles. Le système de matching est impressionnant et nous a fait gagner un temps précieux dans notre processus de recrutement.',
        rating: 5,
    },
    {
        name: 'Pierre Leroy',
        role: 'Talent Acquisition Manager',
        company: 'InnovCorp',
        image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        quote: 'La qualité des profils proposés par JobNexus est remarquable. Les candidats correspondent parfaitement à nos critères et sont déjà bien préparés grâce aux outils d\'optimisation de CV. Cela facilite grandement notre travail de recrutement.',
        rating: 5,
    },
    {
        name: 'Camille Bertrand',
        role: 'Responsable Recrutement',
        company: 'DigitalSolutions',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        quote: 'Nous utilisons JobNexus depuis plus d\'un an et les résultats sont exceptionnels. Le temps de recrutement a été réduit de 40% et la qualité des candidats est nettement supérieure. L\'interface de gestion des candidatures est intuitive et efficace.',
        rating: 4,
    },
];
export function TestimonialsPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { t } = useTranslation();
    const { user } = useAuth();
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsxs("header", { className: "fixed inset-x-0 top-0 z-50 backdrop-blur-sm border-b border-white/10", children: [_jsxs("nav", { className: "flex items-center justify-between p-6 lg:px-8", "aria-label": "Global", children: [_jsx("div", { className: "flex lg:flex-1", children: _jsxs(Link, { to: "/", className: "-m-1.5 p-1.5", children: [_jsx("span", { className: "sr-only", children: "JobNexus" }), _jsx("div", { className: "text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text", children: "JobNexus" })] }) }), _jsx("div", { className: "flex lg:hidden", children: _jsxs("button", { type: "button", className: "-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white", onClick: () => setMobileMenuOpen(true), children: [_jsx("span", { className: "sr-only", children: "Open main menu" }), _jsx(Bars3Icon, { className: "h-6 w-6", "aria-hidden": "true" })] }) }), _jsx("div", { className: "hidden lg:flex lg:gap-x-12", children: publicNavigation.map((item) => (_jsx(Link, { to: item.href, className: "text-sm font-semibold leading-6 text-white hover:text-primary-400 transition-colors", children: item.name }, item.name))) }), _jsxs("div", { className: "hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-4", children: [_jsx(LanguageSwitcher, {}), !user && (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/login", className: "text-sm font-semibold px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-colors", children: t('auth.login') }), _jsx(Link, { to: "/pricing", className: "text-sm font-semibold px-3 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-500 hover:to-secondary-500 transition-colors", children: t('auth.startTrial') })] }))] })] }), _jsxs(Dialog, { as: "div", className: "lg:hidden", open: mobileMenuOpen, onClose: setMobileMenuOpen, children: [_jsx("div", { className: "fixed inset-0 z-50" }), _jsxs(Dialog.Panel, { className: "fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(Link, { to: "/", className: "-m-1.5 p-1.5", children: [_jsx("span", { className: "sr-only", children: "JobNexus" }), _jsx("div", { className: "text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text", children: "JobNexus" })] }), _jsxs("button", { type: "button", className: "-m-2.5 rounded-md p-2.5 text-white", onClick: () => setMobileMenuOpen(false), children: [_jsx("span", { className: "sr-only", children: "Close menu" }), _jsx(XMarkIcon, { className: "h-6 w-6", "aria-hidden": "true" })] })] }), _jsx("div", { className: "mt-6 flow-root", children: _jsxs("div", { className: "-my-6 divide-y divide-white/10", children: [_jsx("div", { className: "space-y-2 py-6", children: publicNavigation.map((item) => (_jsx(Link, { to: item.href, className: "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-white/10", onClick: () => setMobileMenuOpen(false), children: item.name }, item.name))) }), _jsxs("div", { className: "py-6", children: [_jsx("div", { className: "mb-4", children: _jsx(LanguageSwitcher, {}) }), !user && (_jsxs("div", { className: "space-y-4", children: [_jsx(Link, { to: "/login", className: "block text-center text-sm font-semibold px-3 py-2 rounded-lg text-white hover:bg-white/10 transition-colors", children: t('auth.login') }), _jsx(Link, { to: "/pricing", className: "block text-center text-sm font-semibold px-3 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-500 hover:to-secondary-500 transition-colors", children: t('auth.startTrial') })] }))] })] }) })] })] })] }), _jsxs("main", { children: [_jsxs("div", { className: "relative isolate pt-24", children: [_jsx("div", { className: "absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80", "aria-hidden": "true", children: _jsx("div", { className: "relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-600 to-secondary-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]", style: {
                                        clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                                    } }) }), _jsx("div", { className: "py-24 sm:py-32", children: _jsx("div", { className: "mx-auto max-w-7xl px-6 lg:px-8", children: _jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [_jsx(motion.h1, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text", children: "T\u00E9moignages" }), _jsx(motion.p, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.2 }, className: "mt-6 text-lg leading-8 text-gray-300", children: "D\u00E9couvrez ce que nos utilisateurs disent de JobNexus et comment notre plateforme a transform\u00E9 leur recherche d'emploi et leur processus de recrutement." })] }) }) })] }), _jsx("div", { className: "py-24 sm:py-32 bg-white/5", children: _jsxs("div", { className: "mx-auto max-w-7xl px-6 lg:px-8", children: [_jsxs("div", { className: "mx-auto max-w-2xl lg:text-center", children: [_jsx("h2", { className: "text-base font-semibold leading-7 text-primary-400", children: "T\u00E9moignages de candidats" }), _jsx("p", { className: "mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl", children: "Ils ont trouv\u00E9 leur emploi id\u00E9al avec JobNexus" }), _jsx("p", { className: "mt-6 text-lg leading-8 text-gray-300", children: "D\u00E9couvrez comment JobNexus a aid\u00E9 ces professionnels \u00E0 trouver le poste de leurs r\u00EAves et \u00E0 acc\u00E9l\u00E9rer leur carri\u00E8re." })] }), _jsx("div", { className: "mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3", children: testimonials.map((testimonial, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.1 * index }, className: "flex flex-col bg-white/10 rounded-2xl p-8 shadow-lg", children: [_jsxs("div", { className: "flex items-center gap-4 mb-4", children: [_jsx("img", { src: testimonial.image, alt: testimonial.name, className: "h-12 w-12 rounded-full object-cover" }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-white", children: testimonial.name }), _jsxs("p", { className: "text-sm text-gray-400", children: [testimonial.role, " chez ", testimonial.company] })] })] }), _jsx("div", { className: "flex mb-4", children: [...Array(5)].map((_, i) => (_jsx(StarIcon, { className: `h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'}` }, i))) }), _jsxs("blockquote", { className: "flex-1 text-gray-300", children: ["\"", testimonial.quote, "\""] })] }, index))) })] }) }), _jsx("div", { className: "py-24 sm:py-32", children: _jsxs("div", { className: "mx-auto max-w-7xl px-6 lg:px-8", children: [_jsxs("div", { className: "mx-auto max-w-2xl lg:text-center", children: [_jsx("h2", { className: "text-base font-semibold leading-7 text-primary-400", children: "T\u00E9moignages de recruteurs" }), _jsx("p", { className: "mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl", children: "Ils ont optimis\u00E9 leur processus de recrutement" }), _jsx("p", { className: "mt-6 text-lg leading-8 text-gray-300", children: "D\u00E9couvrez comment JobNexus aide les recruteurs \u00E0 trouver les meilleurs talents plus rapidement et plus efficacement." })] }), _jsx("div", { className: "mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3", children: recruiterTestimonials.map((testimonial, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.1 * index }, className: "flex flex-col bg-white/10 rounded-2xl p-8 shadow-lg", children: [_jsxs("div", { className: "flex items-center gap-4 mb-4", children: [_jsx("img", { src: testimonial.image, alt: testimonial.name, className: "h-12 w-12 rounded-full object-cover" }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-white", children: testimonial.name }), _jsxs("p", { className: "text-sm text-gray-400", children: [testimonial.role, " chez ", testimonial.company] })] })] }), _jsx("div", { className: "flex mb-4", children: [...Array(5)].map((_, i) => (_jsx(StarIcon, { className: `h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'}` }, i))) }), _jsxs("blockquote", { className: "flex-1 text-gray-300", children: ["\"", testimonial.quote, "\""] })] }, index))) })] }) }), _jsx("div", { className: "bg-white/5 py-24 sm:py-32", children: _jsxs("div", { className: "mx-auto max-w-7xl px-6 lg:px-8", children: [_jsxs("div", { className: "mx-auto max-w-2xl lg:text-center", children: [_jsx("h2", { className: "text-base font-semibold leading-7 text-primary-400", children: "R\u00E9sultats prouv\u00E9s" }), _jsx("p", { className: "mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl", children: "Des chiffres qui parlent d'eux-m\u00EAmes" }), _jsx("p", { className: "mt-6 text-lg leading-8 text-gray-300", children: "D\u00E9couvrez l'impact concret de JobNexus sur la recherche d'emploi et le recrutement." })] }), _jsxs("div", { className: "mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:max-w-none lg:grid-cols-4", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.1 }, className: "bg-white/10 rounded-2xl p-8 text-center", children: [_jsx("p", { className: "text-4xl font-bold text-primary-400 mb-2", children: "87%" }), _jsx("p", { className: "text-gray-300", children: "des utilisateurs trouvent un emploi dans les 3 mois" })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.2 }, className: "bg-white/10 rounded-2xl p-8 text-center", children: [_jsx("p", { className: "text-4xl font-bold text-primary-400 mb-2", children: "40%" }), _jsx("p", { className: "text-gray-300", children: "de temps gagn\u00E9 dans le processus de recherche" })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.3 }, className: "bg-white/10 rounded-2xl p-8 text-center", children: [_jsx("p", { className: "text-4xl font-bold text-primary-400 mb-2", children: "12%" }), _jsx("p", { className: "text-gray-300", children: "d'augmentation moyenne de salaire" })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.4 }, className: "bg-white/10 rounded-2xl p-8 text-center", children: [_jsx("p", { className: "text-4xl font-bold text-primary-400 mb-2", children: "95%" }), _jsx("p", { className: "text-gray-300", children: "de taux de satisfaction client" })] })] })] }) }), _jsxs("div", { className: "relative isolate mt-32 px-6 py-32 sm:mt-56 sm:py-40 lg:px-8", children: [_jsx("div", { className: "absolute inset-0 -z-10 overflow-hidden", children: _jsx("div", { className: "absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 bg-gradient-to-tr from-primary-600 to-secondary-600 opacity-10 sm:left-[calc(50%-40rem)]" }) }), _jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [_jsx("h2", { className: "text-3xl font-bold tracking-tight text-white sm:text-4xl", children: "Rejoignez notre communaut\u00E9 de professionnels satisfaits" }), _jsx("p", { className: "mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300", children: "Commencez d\u00E8s aujourd'hui et d\u00E9couvrez comment JobNexus peut transformer votre recherche d'emploi ou votre processus de recrutement." }), _jsxs("div", { className: "mt-10 flex items-center justify-center gap-x-6", children: [_jsx("a", { href: "/pricing", className: "btn-primary", children: "Commencer gratuitement" }), _jsxs("a", { href: "/login", className: "text-sm font-semibold leading-6 text-white", children: ["Se connecter ", _jsx("span", { "aria-hidden": "true", children: "\u2192" })] })] })] })] })] }), _jsx(Footer, {})] }));
}
