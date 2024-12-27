import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);
	{/*const navigate = useNavigate();

	useEffect(() => {
		// Redirigir segun el estado de autenticacion
		if(store.authToken) {
			if(store.role === "user") {
				navigate("/user");
			}else if(store.role === "admin") {
				navigate("/admin");
			}
		}else{
			navigate("/public");
		}
	}, [store.authToken, store.role, navigate]);*/}

	return (
		<div className="container my-5">
			{/* infomacion general para todos */}
			<div className="info-section">
			<h1> Bienvenidos a Global Turist</h1>
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
