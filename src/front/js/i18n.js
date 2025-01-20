import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: "Welcome to the app",
      logout: "Logout",
      text_home: "This is a check-in management platform for tourists and hotel administrators. Here you will find all the information needed to make your experience easier."
    },
  },
  es: {
    translation: {
      welcome: "Bienvenido a la aplicación",
      logout: "Cerrar sesión",
      text_home: "Esta es una plataforma de gestión de check-ins para turistas y administradores de hoteles. Aquí encontrarás toda la información necesaria para facilitar tu experiencia"
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