import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../store/appContext"; // Importar el contexto global
import { Register } from "../component/Register.jsx";
import "../../styles/login.css";

export const Login = () => {
  const { store } = useContext(Context);

  // Redirige al usuario si ya está autenticado
  if (store.authToken) {
    return <Navigate to="/" />;
  }

  return (
    <div className="login-page-container">
      <div className="login-box">
        <Register /> {/* Register se encarga de manejar login y signup */}
      </div>
    </div>
  );
};