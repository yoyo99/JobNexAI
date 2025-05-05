import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];
import { useEffect } from 'react';
export default function LanguageSwitcher() {
    var _a;
    const { i18n, t } = useTranslation();
    // Détection automatique de la langue du navigateur au premier chargement
    useEffect(() => {
        var _a, _b, _c, _d;
        const storedLang = localStorage.getItem('i18nextLng');
        if (!storedLang) {
            const browserLang = ((_b = (_a = navigator.languages) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.split('-')[0]) || ((_c = navigator.language) === null || _c === void 0 ? void 0 : _c.split('-')[0]) || 'en';
            const supportedLang = ((_d = languages.find(l => l.code === browserLang)) === null || _d === void 0 ? void 0 : _d.code) || 'en';
            i18n.changeLanguage(supportedLang);
            localStorage.setItem('i18nextLng', supportedLang);
        }
    }, [i18n]);
    return (_jsxs(Menu, { as: "div", className: "relative", children: [_jsx(motion.div, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: _jsxs(Menu.Button, { className: "flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-gray-300 rounded-lg hover:bg-white/5", "aria-haspopup": "listbox", "aria-label": t('Change language'), children: [_jsx(GlobeAltIcon, { className: "h-5 w-5", "aria-hidden": "true" }), _jsx("span", { className: "hidden md:block", children: ((_a = languages.find(l => l.code === i18n.language)) === null || _a === void 0 ? void 0 : _a.name) || 'Language' })] }) }), _jsx(Transition, { as: Fragment, enter: "transition ease-out duration-100", enterFrom: "transform opacity-0 scale-95", enterTo: "transform opacity-100 scale-100", leave: "transition ease-in duration-75", leaveFrom: "transform opacity-100 scale-100", leaveTo: "transform opacity-0 scale-95", children: _jsx(Menu.Items, { className: "absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none", children: languages.map((lang) => (_jsx(Menu.Item, { children: ({ active }) => (_jsxs("button", { className: `flex items-center gap-3 w-full px-4 py-2 text-sm leading-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 ${i18n.language === lang.code
                                ? 'bg-gray-50 text-primary-600'
                                : active
                                    ? 'text-gray-900 bg-gray-100'
                                    : 'text-gray-900 hover:bg-gray-50'}`, onClick: () => {
                                i18n.changeLanguage(lang.code);
                                localStorage.setItem('i18nextLng', lang.code);
                            }, "aria-selected": i18n.language === lang.code, tabIndex: 0, children: [_jsx("span", { className: "text-base", "aria-hidden": "true", children: lang.flag }), lang.name] })) }, lang.code))) }) })] }));
}
