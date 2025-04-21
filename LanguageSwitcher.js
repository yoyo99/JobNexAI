"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageSwitcher = LanguageSwitcher;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_i18next_1 = require("react-i18next");
const react_1 = require("react");
const react_2 = require("@headlessui/react");
const outline_1 = require("@heroicons/react/24/outline");
const framer_motion_1 = require("framer-motion");
const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];
function LanguageSwitcher() {
    var _a;
    const { i18n, t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(react_2.Menu, { as: "div", className: "relative", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: (0, jsx_runtime_1.jsxs)(react_2.Menu.Button, { className: "flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-gray-300 rounded-lg hover:bg-white/5", children: [(0, jsx_runtime_1.jsx)(outline_1.GlobeAltIcon, { className: "h-5 w-5", "aria-hidden": "true" }), (0, jsx_runtime_1.jsx)("span", { className: "hidden md:block", children: ((_a = languages.find(l => l.code === i18n.language)) === null || _a === void 0 ? void 0 : _a.name) || 'Language' })] }) }), (0, jsx_runtime_1.jsx)(react_2.Transition, { as: react_1.Fragment, enter: "transition ease-out duration-100", enterFrom: "transform opacity-0 scale-95", enterTo: "transform opacity-100 scale-100", leave: "transition ease-in duration-75", leaveFrom: "transform opacity-100 scale-100", leaveTo: "transform opacity-0 scale-95", children: (0, jsx_runtime_1.jsx)(react_2.Menu.Items, { className: "absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none", children: languages.map((lang) => ((0, jsx_runtime_1.jsx)(react_2.Menu.Item, { children: (0, jsx_runtime_1.jsxs)("button", { className: `flex items-center gap-3 w-full px-4 py-2 text-sm leading-6 ${i18n.language === lang.code
                                ? 'bg-gray-50 text-primary-600'
                                : 'text-gray-900 hover:bg-gray-50'}`, onClick: () => i18n.changeLanguage(lang.code), children: [(0, jsx_runtime_1.jsx)("span", { className: "text-base", children: lang.flag }), lang.name] }) }, lang.code))) }) })] }));
}
