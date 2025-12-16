import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend) // Load translations from JSON files
  .use(LanguageDetector) // Detect user's language
  .use(initReactI18next) // Bind i18next to React
  .init({
    lng: 'vi',
    fallbackLng: 'vi', // Default language
    supportedLngs: ['en', 'vi'], // Supported languages
    debug: true, // Enable debug logs
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Path to translation files
    },
  });

export default i18n;
