import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: "Welcome to the app",
      logout: "Logout",
    },
  },
  es: {
    translation: {
      welcome: "Bienvenido a la aplicación",
      logout: "Cerrar sesión",
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    debug: true,
  });

export default i18n;