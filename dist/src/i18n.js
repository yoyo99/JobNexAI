import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enAuth from '../public/locales/en/translation.json';
import frAuth from '../public/locales/fr/translation.json';
// Si tu as des fichiers séparés pour 'common', adapte ici.
const resources = {
    en: {
        auth: enAuth.auth,
        common: enAuth.common || {},
        hero: enAuth.hero || {},
        translation: enAuth
    },
    fr: {
        auth: frAuth.auth,
        common: frAuth.common || {},
        hero: frAuth.hero || {},
        translation: frAuth
    }
};
// Ajoute ici d'autres langues si besoin
// Initialisation de i18next avec les fichiers de traduction
// et configuration de la langue par défaut
i18n
    .use(initReactI18next)
    .init({
    resources,
    lng: 'fr', // langue par défaut
    fallbackLng: 'en',
    ns: ['auth', 'common', 'hero'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
});
export default i18n;
