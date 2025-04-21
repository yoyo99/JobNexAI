"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = __importDefault(require("i18next"));
const react_i18next_1 = require("react-i18next");
const i18next_browser_languagedetector_1 = __importDefault(require("i18next-browser-languagedetector"));
const i18next_http_backend_1 = __importDefault(require("i18next-http-backend"));
i18next_1.default
    .use(i18next_http_backend_1.default)
    .use(i18next_browser_languagedetector_1.default)
    .use(react_i18next_1.initReactI18next)
    .init({
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en'],
    defaultNS: 'common',
    ns: ['common'],
    interpolation: {
        escapeValue: false,
    },
    detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
    },
});
exports.default = i18next_1.default;
