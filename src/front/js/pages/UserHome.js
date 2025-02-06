import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { FaShare } from "react-icons/fa";
import "../../styles/userHome.css";
import NavbarHeader from "../component/NavbarHeader.jsx";
import ContactBanner from "../component/ContactBanner.jsx";
import NavbarFooter from "../component/NavbarFooter.jsx";
const UserHome = () => {
  const { actions, store } = useContext(Context);
  const navigate = useNavigate();
  const [lastQr, setLastQr] = useState(null);
  useEffect(() => {
    const localToken = localStorage.getItem("authToken");
    if (!localToken || localToken === "null" || localToken === "undefined" || localToken.trim() === "") {
      console.log("Token inválido. Redirigiendo a Login...");
      navigate("/login", { replace: true });
    } else {
      fetchLastQr();
    }
  }, [navigate]);
  const fetchLastQr = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const userId = 1; // Por ahora hardcodeado como antes
      const BACKEND_URL = process.env.BACKEND_URL;
      const response = await fetch(`${BACKEND_URL}api/user/${userId}/qrcodes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Error al obtener QRs');
      const data = await response.json();
      if (data.success && data.qr_codes.length > 0) {
        setLastQr(data.qr_codes[0]); // Tomamos el primer QR (el más reciente)
      }
    } catch (error) {
      console.log("Error al obtener el último QR");
    }
  };
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: lastQr.nombre,
          text: `Del ${lastQr.fecha_inicio} al ${lastQr.fecha_fin}`,
          url: window.location.href
        });
      }
    } catch (error) {
      console.log("Error al compartir");
    }
  };
  const handleLogOut = () => {
    console.log("Cerrando Sesión");
    localStorage.removeItem("authToken");
    actions.logout();
    navigate("/login", { replace: true });
  };
  return (
    <div className="user-home-container">
      <NavbarHeader />
      <div className="user-home-content">
        <div className="user-home">
          <main className="user-main">
            {lastQr && (
              <>
                <div className="trip-info">
                  <h2>{lastQr.nombre}</h2>
                  <p>Del {lastQr.fecha_inicio} al {lastQr.fecha_fin}</p>
                </div>
                <div className="qr-container">
                  <img src={lastQr.data} alt="QR Code" />
                </div>
                <div className="action-buttons">
                  <button className="share-button" onClick={handleShare}>
                    <FaShare />
                  </button>
                </div>
              </>
            )}
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