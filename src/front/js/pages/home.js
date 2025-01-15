import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";
import { useTranslation } from 'react-i18next';

export const Home = () => {
	const { store, actions } = useContext(Context);

	const { t } = useTranslation();


	return (
		<div className="container my-5">
			{/* infomacion general para todos */}
			<div className="info-section">
			<h1> {t('titulo')} </h1>
			<p>
			    Esta es una plataforma de gestión de check-ins para turistas y
                administradores de hoteles. Aquí encontrarás toda la información
                necesaria para facilitar tu experiencia.
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
