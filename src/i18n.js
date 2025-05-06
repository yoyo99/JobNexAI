import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importation des fichiers de traduction pour toutes les langues supportées
import enCommon from '../public/locales/en/common.json';
import enTranslation from '../public/locales/en/translation.json';
import frCommon from '../public/locales/fr/common.json';
import frTranslation from '../public/locales/fr/translation.json';
import deCommon from '../public/locales/de/common.json';
import deTranslation from '../public/locales/de/translation.json';
import esCommon from '../public/locales/es/common.json';
import esTranslation from '../public/locales/es/translation.json';
import itCommon from '../public/locales/it/common.json';
import itTranslation from '../public/locales/it/translation.json';

// Configuration des ressources pour i18next
const resources = {
  en: {
    common: enCommon,
    translation: enTranslation
  },
  fr: {
    common: frCommon,
    translation: frTranslation
  },
  de: {
    common: deCommon,
    translation: deTranslation
  },
  es: {
    common: esCommon,
    translation: esTranslation
  },
  it: {
    common: itCommon,
    translation: itTranslation
  }
};

// Initialisation de i18next avec les fichiers de traduction
// et configuration de la langue par défaut
i18n
  .use(Backend) // Charge les traductions depuis le serveur si nécessaire
  .use(LanguageDetector) // Détecte la langue du navigateur
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // langue par défaut
    fallbackLng: 'en',
    ns: [
      'common', // Contient les traductions communes (navigation, auth, forms, etc.)
      'translation' // Contient les traductions spécifiques aux pages
    ],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    // Ajout de la détection de la langue
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage', 'cookie']
    }
  });

export default i18n;
