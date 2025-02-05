import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/userHome.css";
import NavbarHeader from "../component/NavbarHeader.jsx";
import ContactBanner from "../component/ContactBanner.jsx";
import NavbarFooter from "../component/NavbarFooter.jsx";

const UserHome = () => {
  const { actions, store } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    const localToken = localStorage.getItem("authToken");
    console.log("📌 Token en localStorage:", localToken);

    if (!localToken || localToken === "null" || localToken === "undefined" || localToken.trim() === "") {
      console.log("❌ Token inválido. Redirigiendo a Login...");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleLogOut = () => {
    console.log("Cerrando Sesión");
    localStorage.removeItem("authToken"); // 🔥 Eliminar token
    actions.logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="user-home-container">
      <NavbarHeader />
      <div className="user-home-content">
        <div className="user-home">
          <main className="user-main">
            <div className="trip-info">
              <h2>Viaje a Barcelona</h2>
              <p>Del 14/02/2025 al 18/02/2025</p>
            </div>
            <div className="qr-container">
              <img src={store.qrCodeUrl || "qr-placeholder.png"} alt="QR Code" className="qr-image" />
            </div>
            <button className="action-button" onClick={handleLogOut}>Cerrar Sesión</button>
          </main>
        </div>
        <ContactBanner />
        <NavbarFooter />
      </div>
    </div>
  );
};

export default UserHome;
