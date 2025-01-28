import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Register } from "../component/Register.jsx";
import "../../styles/login.css";

export const Login = () => {
  console.log("🔍 Login.js se está ejecutando");

  const { store } = useContext(Context);
  const [isLoading, setIsLoading] = useState(true);
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    console.log("🔍 store.authToken:", store.authToken);
    // Verificamos si el token es válido (no "null", "undefined" ni una cadena vacía)
    if (
      store.authToken &&
      store.authToken !== "null" &&
      store.authToken !== "undefined" &&
      store.authToken !== ""
    ) {
      setValidToken(true);
    }
    setIsLoading(false); // Ya terminamos la verificación
  }, [store.authToken]);
  if (isLoading) {
    return <h1>Cargando...</h1>; // Evita parpadeos en la pantalla
  }

  if (validToken) {
    console.log("🔄 Redirigiendo a /userhome");
    return <Navigate to="/userhome" />;
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <Register />
      </div>
    </div>
  );
};
