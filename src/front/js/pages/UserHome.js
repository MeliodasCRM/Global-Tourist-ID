import React, { useContext, useState } from "react";
import { Dropdown } from "react-bootstrap"; // Importa react-bootstrap Dropdown
import { FaUser, FaBriefcase, FaQrcode, FaBuilding, FaCog } from "react-icons/fa"; // Usamos react-icons
import '../../styles/userHome.css'; // Asegúrate de tener tus estilos específicos
import { Context } from "../store/appContext";
import { Link, useLocation } from "react-router-dom";
import NavbarHeader from "../component/NavbarHeader.jsx";
import ContactBanner from "../component/ContactBanner.jsx";
import NavbarFooter from "../component/NavbarFooter.jsx";

const UserHome = () => {
  const location = useLocation();

  const { actions } = useContext(Context);
  console.log("🔍 UserHome.js se está ejecutando");
  const navigate = useNavigate();

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

  const handleLogOut = () => {
    console.log("Cerrando Sesión");
    actions.logout();
    navigate("/login");
  };

  const handleGoToHome = () => {
    actions.logout();
    navigate("/"); // Ahora usa "navigate" en minúscula
  }
  const handleFaUser = () => {
    navigate("/userinfo");
  }

  return (
    <div className="user-home-container">
      <NavbarHeader prevLocation={location.state?.from} />
      <div className="user-home-content">
        <div className="user-home">


          {/* Contenido Principal */}
          <main className="user-main">
            {/* Caja de Información del Viaje */}
            <div className="trip-info">
              <h2>Viaje a Barcelona</h2>
              <p>Del 14/02/2025 al 18/02/2025</p>
            </div>

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
            </div>
          </main>
        </div>
        <ContactBanner />
        <NavbarFooter />
      </div>
    </div>
  );

};

export default UserHome;