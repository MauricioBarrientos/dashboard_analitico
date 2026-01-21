import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en/translation.json';
import es from './locales/es/translation.json';

// Create locales directories
// Note: In a real project, these would be separate files
const resources = {
  en: {
    translation: en
  },
  es: {
    translation: es
  }
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: true,
    
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    
    // Array of namespaces to load
    ns: ['translation'],
    defaultNS: 'translation',
    
    // Options for language detection
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;