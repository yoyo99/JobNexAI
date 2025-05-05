import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { VideoModal } from './VideoModal';
import { PlayCircleIcon, CheckIcon } from '@heroicons/react/24/outline';
export function Hero() {
    const { t } = useTranslation();
    const testimonials = [
        {
            name: t('hero.testimonials.0.name'),
            role: t('hero.testimonials.0.role'),
            quote: t('hero.testimonials.0.quote'),
        },
        {
            name: t('hero.testimonials.1.name'),
            role: t('hero.testimonials.1.role'),
            quote: t('hero.testimonials.1.quote'),
        },
        {
            name: t('hero.testimonials.2.name'),
            role: t('hero.testimonials.2.role'),
            quote: t('hero.testimonials.2.quote'),
        },
        {
            name: t('hero.testimonials.3.name'),
            role: t('hero.testimonials.3.role'),
            quote: t('hero.testimonials.3.quote'),
        },
        {
            name: t('hero.testimonials.4.name'),
            role: t('hero.testimonials.4.role'),
            quote: t('hero.testimonials.4.quote'),
        },
        {
            name: t('hero.testimonials.5.name'),
            role: t('hero.testimonials.5.role'),
            quote: t('hero.testimonials.5.quote'),
        },
    ];
    const steps = [
        {
            title: t('hero.steps.0.title'),
            description: t('hero.steps.0.description'),
        },
        {
            title: t('hero.steps.1.title'),
            description: t('hero.steps.1.description'),
        },
        {
            title: t('hero.steps.2.title'),
            description: t('hero.steps.2.description'),
        },
    ];
    const [showVideo, setShowVideo] = useState(false);
    const features = t('hero.features', { returnObjects: true });
    function getFeatureDescription(index) {
        const descriptions = t('hero.featureDescriptions', { returnObjects: true });
        return descriptions[index] || '';
    }
    return (_jsxs("div", { children: [_jsxs("div", { className: "relative isolate pt-14", children: [_jsx("div", { className: "absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80", "aria-hidden": "true", children: _jsx("div", { className: "relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-600 to-secondary-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]", style: {
                                clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                            } }) }), _jsx("div", { className: "py-24 sm:py-32 lg:pb-40", children: _jsxs("div", { className: "mx-auto max-w-7xl px-6 lg:px-8", children: [_jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [_jsx(motion.h1, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text", children: t('hero.title') }), _jsx(motion.p, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.2 }, className: "mt-6 text-lg leading-8 text-gray-300", children: t('hero.subtitle') }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.4 }, className: "mt-10 flex items-center justify-center gap-x-6", children: [_jsx(Link, { to: "/pricing", className: "btn-primary", children: t('hero.ctaStart') }), _jsxs("button", { onClick: () => setShowVideo(true), className: "btn-secondary inline-flex items-center gap-2", children: [_jsx(PlayCircleIcon, { className: "h-5 w-5" }), t('hero.watchDemo', 'Voir la démo')] })] })] }), _jsx(motion.div, { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.6 }, className: "mt-16 flow-root sm:mt-24", children: _jsx("div", { className: "rounded-xl bg-white/5 p-2 ring-1 ring-inset ring-white/10 lg:rounded-2xl", children: _jsx("img", { src: "/landing.jpg", alt: t('hero.imageAlt'), className: "rounded-md shadow-2xl ring-1 ring-white/10 w-full h-auto" }) }) })] }) })] }), _jsxs("div", { className: "mx-auto max-w-7xl px-6 lg:px-8 pb-24", id: "features", children: [_jsxs("div", { className: "mx-auto max-w-2xl lg:text-center", children: [_jsx("h2", { className: "text-base font-semibold leading-7 text-primary-400", children: t('hero.featuresSectionTitle') }), _jsx("p", { className: "mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl", children: t('hero.featuresSectionSubtitle') }), _jsx("p", { className: "mt-6 text-lg leading-8 text-gray-300", children: t('hero.featuresSectionDescription') })] }), _jsx("div", { className: "mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl", children: _jsx("dl", { className: "grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16", children: (Array.isArray(features) ? features : []).map((feature, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.1 * index }, className: "relative pl-16", children: [_jsxs("dt", { className: "text-base font-semibold leading-7 text-white", children: [_jsx("div", { className: "absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600", children: _jsx(CheckIcon, { className: "h-6 w-6 text-white", "aria-hidden": "true" }) }), feature] }), _jsx("dd", { className: "mt-2 text-base leading-7 text-gray-400", children: getFeatureDescription(index) })] }, index))) }) })] }), _jsx("div", { className: "bg-white/5 py-24 sm:py-32", id: "how-it-works", children: _jsxs("div", { className: "mx-auto max-w-7xl px-6 lg:px-8", children: [_jsxs("div", { className: "mx-auto max-w-2xl lg:text-center", children: [_jsx("h2", { className: "text-base font-semibold leading-7 text-primary-400", children: t('hero.howItWorksSectionTitle') }), _jsx("p", { className: "mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl", children: t('hero.howItWorksSectionSubtitle') }), _jsx("p", { className: "mt-6 text-lg leading-8 text-gray-300", children: t('hero.howItWorksSectionDescription') })] }), _jsx("div", { className: "mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl", children: _jsx("div", { className: "grid grid-cols-1 gap-12 lg:grid-cols-3", children: (Array.isArray(steps) ? steps : []).map((step, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.1 * index }, className: "relative", children: [_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white text-xl font-bold", children: index + 1 }), _jsx("span", { className: "sr-only", children: t('hero.stepNumber', { number: index + 1 }) }), _jsx("h3", { className: "mt-6 text-lg font-semibold leading-8 text-white", children: step.title }), _jsx("p", { className: "mt-2 text-base leading-7 text-gray-400", children: step.description })] }, index))) }) })] }) }), _jsx("div", { className: "bg-white/5 py-24 sm:py-32", id: "about", children: _jsxs("div", { className: "mx-auto max-w-7xl px-6 lg:px-8", children: [_jsxs("div", { className: "mx-auto max-w-xl text-center", children: [_jsx("h2", { className: "text-lg font-semibold leading-8 tracking-tight text-primary-400", children: t('hero.testimonialsSectionTitle') }), _jsx("p", { className: "mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl", children: t('hero.testimonialsSectionSubtitle') })] }), _jsx("div", { className: "mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none", children: _jsx("div", { className: "-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3", children: (Array.isArray(testimonials) ? testimonials : []).map((testimonial, index) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.1 * index }, className: "pt-8 sm:inline-block sm:w-full sm:px-4", children: _jsxs("figure", { className: "rounded-2xl bg-white/5 p-8 text-sm leading-6", children: [_jsx("blockquote", { className: "text-white", children: _jsx("p", { children: `"${testimonial.quote}"` }) }), _jsxs("figcaption", { className: "mt-6 flex items-center gap-x-4", children: [_jsx("div", { className: "h-10 w-10 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center text-white font-semibold", children: testimonial.name[0] }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold text-white", children: testimonial.name }), _jsx("div", { className: "text-gray-400", children: testimonial.role })] })] })] }) }, index))) }) })] }) }), _jsxs("div", { className: "relative isolate mt-32 px-6 py-32 sm:mt-56 sm:py-40 lg:px-8", children: [_jsx("div", { className: "absolute inset-0 -z-10 overflow-hidden", children: _jsx("div", { className: "absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 bg-gradient-to-tr from-primary-600 to-secondary-600 opacity-10 sm:left-[calc(50%-40rem)]" }) }), _jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [_jsx("h2", { className: "text-3xl font-bold tracking-tight text-white sm:text-4xl", children: t('hero.ctaFinalTitle') }), _jsx("p", { className: "mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300", children: t('hero.ctaFinalSubtitle') }), _jsxs("div", { className: "mt-10 flex items-center justify-center gap-x-6", children: [_jsx(Link, { to: "/pricing", className: "btn-primary", children: t('hero.ctaFinalStart') }), _jsxs(Link, { to: "/login", className: "text-sm font-semibold leading-6 text-white", children: [t('hero.ctaFinalLogin'), " ", _jsx("span", { "aria-hidden": "true", children: "\u2192" })] })] })] })] }), _jsx(VideoModal, { isOpen: showVideo, onClose: () => setShowVideo(false) })] }));
}
export default Hero;
