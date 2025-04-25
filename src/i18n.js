// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import translationEN from './locales/en/translation.json';
import translationHI from './locales/hi/translation.json';

// the translations
const resources = {
    en: {
        translation: translationEN
    },
    hi: {
        translation: translationHI
    }
};

i18n
    // detect user language
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next
    .use(initReactI18next)
    // init i18next
    .init({
        resources,
        fallbackLng: 'en',
        debug: import.meta.env.MODE === 'development',


        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },

        // language detection options
        detection: {
            order: ['localStorage', 'navigator'],
            lookupLocalStorage: 'language',
            caches: ['localStorage']
        }
    });

export default i18n;