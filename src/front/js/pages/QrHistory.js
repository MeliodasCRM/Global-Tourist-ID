import React, { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import NavbarHeader from "../component/NavbarHeader.jsx";
import UserQrCard from "../component/UserQrCard.jsx"; // Importa el componente UserQrCard
import ContactBanner from "../component/ContactBanner.jsx";
import NavbarFooter from "../component/NavbarFooter.jsx";
import "../../styles/qrView/qrhistory.css";

const QrHistory = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  // Asegúrate de que los qr_codes estén cargados solo si no están disponibles en el store
  useEffect(() => {
    if (!store.qr_codes || store.qr_codes.length === 0) {
      actions.loadQrCodes(); // Cargar los códigos QR si no están disponibles en el store
    }
  }, [store.qr_codes, actions]);  // Agrega "actions" como dependencia para evitar el bucle infinito

  // Función para ver más detalles del código QR
  const handleVerContacto = (id) => {
    navigate(`/qr-details/${id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(2, 4); // Solo los dos últimos dígitos del año
  
    return `${day}/${month}/${year}`;
  };

  const handleDeleteQR = async (qrId) => {
    try {
       const token = localStorage.getItem("authToken");
       const userId = localStorage.getItem("userId");
       const BACKEND_URL = process.env.BACKEND_URL;
       if (!token || !userId) {
          throw new Error('Falta token o ID de usuario');
       }
       const response = await fetch(`${BACKEND_URL}api/user/${userId}/qrcode/${qrId}`, {
          method: 'DELETE',
          headers: {
             'Authorization': `Bearer ${token}`,
             'Content-Type': 'application/json'
          }
       });
       const result = await response.json();
       if (!response.ok) {
          throw new Error(result.message || 'Error al eliminar el QR');
       }
       setQrList(prevList => prevList.filter(qr => qr.id !== qrId));
    } catch (error) {
       console.error("Error al eliminar el QR:", error);
    }
 };

  return (
    <div className="qr-history-container">
      <div className="qr-history-header">
        <NavbarHeader prevLocation={location.state?.from} />
      </div>
      <div className="qr-history-body">
        {store.qr_codes && store.qr_codes.length > 0 ? (
          store.qr_codes.map((qrCode) => (
            <UserQrCard
              key={qrCode.id}
              id={qrCode.id}
              nombre={qrCode.nombre}
              fecha_inicio={qrCode.fecha_inicio}
              fecha_fin={qrCode.fecha_fin}
              verContacto={handleVerContacto}
              borrarQR={handleDeleteQR}
            />
          ))
        ) : (
          <p>No se encontraron códigos QR.</p>
        )}
      </div>
      <div className="qr-history-footer">
        <ContactBanner />
        <NavbarFooter />
      </div>
    </div>
  );
};

export default QrHistory;