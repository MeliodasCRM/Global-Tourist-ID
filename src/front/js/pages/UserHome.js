import React, { useContext, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { FaArrowLeft, FaBars, FaShareAlt, FaCopy } from "react-icons/fa";
import { FaHome, FaUser, FaQrcode, FaHistory } from "react-icons/fa";
import "../../styles/userHome.css";

const UserHome = () => {
  const { actions } = useContext(Context);
  console.log("🔍 UserHome.js se está ejecutando");
  const navigate = useNavigate(); // Corregido: ahora usa "navigate" en minúscula

  const { store } = useContext(Context);
  const [validToken, setValidToken] = useState(null);

  useEffect(() => {
    // 📌 Obtener el token directo del localStorage
    const localToken = localStorage.getItem("authToken");

    console.log("📌 Token en localStorage:", localToken);

    if (localToken && localToken !== "null" && localToken !== "undefined" && localToken.trim() !== "") {
      setValidToken(true);
    } else {
      setValidToken(false);
    }
  }, []);

  if (validToken === null) {
    return <h1>Cargando...</h1>; // ⏳ Esperar hasta que se valide el token
  }

  if (!validToken) {
    console.log("❌ Token inválido. Redirigiendo a Login...");
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    actions.setAuthToken(null);
    navigate("/login"); // Ahora usa "navigate" en minúscula
  };

  const handleGoToHome = () => {
    localStorage.removeItem("authToken");
    actions.setAuthToken(null);
    navigate("/"); // Ahora usa "navigate" en minúscula
  }
   const handleFaUser = () => {
    navigate("/userinfo");
   }

  return (
    <div className="user-home">
      {/* NavBar Superior */}
      <header className="user-navbar">
        <button className="nav-button" onClick={handleLogout}>
          <FaArrowLeft />
        </button>
        <h1 className="nav-title">Home User</h1>
        <button className="nav-button" onClick={handleGoToHome}>
          <FaBars />
        </button>
      </header>

      {/* Contenido Principal */}
      <main className="user-main">
        {/* Caja de Información del Viaje */}
        <div className="trip-info">
          <h2>Viaje a Barcelona</h2>
          <p>Del 14/02/2025 al 18/02/2025</p>
        </div>

<<<<<<< HEAD
        {/* Código QR Dinámico */}
        <div className="qr-container">
          <img src={store.qrCodeUrl || "qr-placeholder.png"} alt="QR Code" className="qr-image" />
        </div>

        {/* Botones de Acción */}
        <div className="action-buttons">
          <button className="action-button">
            <FaShareAlt />
          </button>
          <button className="action-button">
            <FaCopy />
          </button>
=======
        <div className="icon-container">
          <div className="icon">
          <Link to="/userInfo">
            <FaUser size={40} color="#333" />
            <p>Users</p>
          </Link>
          </div>
          <div className="icon">
          <Link to="/reservas">
            <FaBriefcase size={40} color="#333" />
            <p>Reservas</p>
            </Link>
          </div>
          <div className="icon">
            <FaQrcode size={40} color="#333" />
            <p>QR Generator</p>
          </div>
          <div className="icon">
            <FaBuilding size={40} color="#333" />
            <p>Empresas</p>
          </div>
>>>>>>> 0813e3e (4-correccion ruta reseva para poder pintarla)
        </div>
      </main>

      {/* Barra de Navegación Inferior */}
      <nav className="bottom-nav">
        <button className="nav-item">
          <FaHome />
        </button>
        <button className="nav-item" onClick={handleFaUser}>
          <FaUser />
        </button>
        <button className="nav-item active">
          <FaQrcode />
        </button>
        <button className="nav-item">
          <FaHistory />
        </button>
      </nav>
    </div>
  );
};

export default UserHome;
