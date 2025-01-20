import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";
import { useTranslation } from 'react-i18next';

export const Home = () => {
	const { store, actions } = useContext(Context);

	const { t, i18n } = useTranslation();

	const changeLanguage = (language) => {
		i18n.changeLanguage(language);
	};


	return (
		<div className="container my-5">
			{/* infomacion general para todos */}
			<div className="info-section">
				<h1> Home Public </h1>
				<div>
					<h1>{t('welcome')}</h1>
					<button onClick={() => changeLanguage('en')}>English</button>
					<button onClick={() => changeLanguage('es')}>Español</button>
				</div>
				<p>
					{t('text_home')}
				</p>
			</div>
			{/* seccion accesible para todos */}
			<div className="general-info">
				<h2>información para todos</h2>
				<ul>
					<li>
						<i className="bi bi-person-circle"></i> ¿Eres un turista? Completa tu check-in antes de llegar.</li>
					<li>
						<i className="bi bi-clipboard-check"></i> ¿Eres administrador? Gestiona los check-ins de forma rápida y eficiente.
					</li>
					<li>
						<i className="bi bi-shield-check"></i> Nuestro sistema cumple con las normativas del Ministerio del Interior.
					</li>
				</ul>

			</div>


		</div>
	);
};
