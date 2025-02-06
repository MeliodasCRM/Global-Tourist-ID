import React, {useEffect} from "react";
import "../../styles/home.css";
import {  useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
export const Home = () => {
  const { t, i18n } = useTranslation();
  const Navigate = useNavigate();
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };
  const handleLoginRedirect = () => {
    Navigate("/login");
  }

  useEffect(() => {
    localStorage.clear();
  }, []);


  return (
    <div className="home-container">
      {/* Sección superior con fondo azul */}
      <div className="top-section">
        {/* Nuevo div exclusivo para "Bienvenido..." */}
        <div className="welcome-container">
          <h1 className="welcome-text">{t('welcome')}</h1>
        </div>
        {/* Contenedor del QR */}
        <div className="qr-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="150"
            height="150"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="qr-icon"
          >
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
            <path d="M14 14h1v1h-1zm3 0h1v1h-1zm0 3h1v1h-1zm-3 3h1v1h-1zm3 0h1v1h-1zm3-3h1v1h-1z"></path>
          </svg>
        </div>
      </div>
      {/* Botones de cambio de idioma */}
      <div className="language-buttons">
        <button className="language-button" onClick={() => changeLanguage('en')}>
          English
        </button>
        <button className="language-button" onClick={() => changeLanguage('es')}>
          Español
        </button>
      </div>
      {/* Sección inferior con fondo oscuro */}
      <div className="bottom-section">
        <div className="divider"></div>
        <h2 className="bottom-title">{t('getStarted')}</h2>
        <p className="bottom-text">
          {t('Get and enjoy Features For Free and make your life easy with us.')}
        </p>
        <button className="start-button" onClick={handleLoginRedirect}>
            <FaArrowRight className="arrow-icon" />
          </button>
      </div>
    </div>
  );
};