import React, { useContext, useState } from "react";
import { Dropdown } from "react-bootstrap"; // Importa react-bootstrap Dropdown
import { FaUser, FaBriefcase, FaQrcode, FaBuilding, FaCog } from "react-icons/fa"; // Usamos react-icons
import '../../styles/userHome.css'; // Asegúrate de tener tus estilos específicos
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

const UserHome = () => {
  const [showDropdown, setShowDropdown] = useState(false);  // Maneja el estado del dropdown
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
    <div className="user-home">
      {/* NavBar Superior */}
      <header className="user-navbar">
        <button className="nav-button" onClick={handleLogOut}>
          <FaArrowLeft />
        </button>
        <h1 className="nav-title">Home User</h1>
        <button className="nav-button" onClick={handleGoToHome}>
          <FaBars />
        </button>
      </header>

      <main className="user-main pt-5 mt-3">
        {/* Código QR */}
        <div className="qr-code">
          <img src="qr-code-placeholder.jpg" alt="QR Code" className="qr-image" />
          <p>Scan to connect</p>
        </div>

        <div className="icon-container">
          <div className="icon">
          <Link to="/userInfo">
            <FaUser size={40} color="#333" />
            <p>Users</p>
          </Link>
          </div>
          <div className="icon">
          <Link to="/userInfo">
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
        </div>
      </main>

      {/* Footer fijo en la parte inferior con Bootstrap */}
      <footer className="user-footer fixed-bottom">
        <img src="banner.jpg" alt="Banner Publicitario" className="banner-image" />
      </footer>
    </div>
  );
};

export default UserHome;