import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
const stepsKeys = [
    {
        title: 'howItWorks.steps.0.title',
        description: 'howItWorks.steps.0.description',
        icon: '1',
    },
    {
        title: 'howItWorks.steps.1.title',
        description: 'howItWorks.steps.1.description',
        icon: '2',
    },
    {
        title: 'howItWorks.steps.2.title',
        description: 'howItWorks.steps.2.description',
        icon: '3',
    },
];
export function HowItWorks() {
    const { t } = useTranslation();
    return (_jsx("div", { className: "bg-white/5 py-24 sm:py-32", id: "how-it-works", children: _jsxs("div", { className: "mx-auto max-w-7xl px-6 lg:px-8", children: [_jsxs("div", { className: "mx-auto max-w-2xl lg:text-center", children: [_jsx("h2", { className: "text-base font-semibold leading-7 text-primary-400", children: t('howItWorks.title') }), _jsx("p", { className: "mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl", children: t('howItWorks.subtitle') }), _jsx("p", { className: "mt-6 text-lg leading-8 text-gray-300", children: t('howItWorks.description') })] }), _jsx("div", { className: "mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl", children: _jsx("div", { className: "grid grid-cols-1 gap-12 lg:grid-cols-3", children: stepsKeys.map((step, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.1 * index }, className: "relative", children: [_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white text-xl font-bold", children: t('howItWorks.stepNumber', { number: step.icon }) }), _jsx("h3", { className: "mt-6 text-lg font-semibold leading-8 text-white", children: t(step.title) }), _jsx("p", { className: "mt-2 text-base leading-7 text-gray-400", children: t(step.description) })] }, index))) }) })] }) }));
}
