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
export default function LanguageSwitcher() {
    var _a;
    const { i18n, t } = useTranslation();
    return (_jsxs(Menu, { as: "div", className: "relative", children: [_jsx(motion.div, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: _jsxs(Menu.Button, { className: "flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-gray-300 rounded-lg hover:bg-white/5", children: [_jsx(GlobeAltIcon, { className: "h-5 w-5", "aria-hidden": "true" }), _jsx("span", { className: "hidden md:block", children: ((_a = languages.find(l => l.code === i18n.language)) === null || _a === void 0 ? void 0 : _a.name) || 'Language' })] }) }), _jsx(Transition, { as: Fragment, enter: "transition ease-out duration-100", enterFrom: "transform opacity-0 scale-95", enterTo: "transform opacity-100 scale-100", leave: "transition ease-in duration-75", leaveFrom: "transform opacity-100 scale-100", leaveTo: "transform opacity-0 scale-95", children: _jsx(Menu.Items, { className: "absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none", children: languages.map((lang) => (_jsx(Menu.Item, { children: _jsxs("button", { className: `flex items-center gap-3 w-full px-4 py-2 text-sm leading-6 ${i18n.language === lang.code
                                ? 'bg-gray-50 text-primary-600'
                                : 'text-gray-900 hover:bg-gray-50'}`, onClick: () => i18n.changeLanguage(lang.code), children: [_jsx("span", { className: "text-base", children: lang.flag }), lang.name] }) }, lang.code))) }) })] }));
}
