import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Register } from "../component/Register.jsx";
import "../../styles/login.css";

export const Login = () => {
  console.log("🔍 Login.js se está ejecutando");

  const { store } = useContext(Context);
  const [isChecking, setIsChecking] = useState(true); // ⏳ Estado para verificar el token
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    console.log("🔍 store.authToken:", store.authToken);

    if (store.authToken && store.authToken !== "null" && store.authToken !== "undefined" && store.authToken.trim() !== "") {
      setValidToken(true);
    } else {
      setValidToken(false);
    }

    setIsChecking(false); // ✅ Estado listo para renderizar
  }, [store.authToken]);

  if (isChecking) {
    return <h1>Cargando...</h1>; // Evita parpadeos
  }

  if (validToken) {
    console.log("✅ Token válido, redirigiendo a /userhome");
    return <Navigate to="/userhome" replace />;
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <Register />
      </div>
    </div>
  );
};