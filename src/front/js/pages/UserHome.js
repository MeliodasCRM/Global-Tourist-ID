import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { FaShare, FaCopy } from "react-icons/fa";  // Usamos los nuevos iconos de react-icons
import NavbarHeader from "../component/NavbarHeader.jsx";
import ContactBanner from "../component/ContactBanner.jsx";
import NavbarFooter from "../component/NavbarFooter.jsx";
import UserQrCard from "../component/UserQrCard.jsx"; // Se asume que este componente se encuentra en la misma carpeta
import "../../styles/userHome.css";

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
    const year = date.getFullYear().toString().slice(2); // Obtener solo las dos últimas cifras del año
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="user-home-container">
      <NavbarHeader />
      <div className="user-home-content">
        {lastQr && (
          <>
            <div className="qr-info-card">
              <UserQrCard
                id={lastQr.id}
                nombre={lastQr.nombre}
                fecha_inicio={formatDate(lastQr.fecha_inicio)}
                fecha_fin={formatDate(lastQr.fecha_fin)}
                data={lastQr.data}
              />
            </div>

            <div className="qr-info-placeholder">
              <img src={lastQr.data} alt="QR Code" />
            </div>

            <div className="qr-info-buttons">
              <button className="share-button" onClick={handleShare}>
                <FaShare />
              </button>
              <button className="copy-button">
                <FaCopy />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserHome;