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

  // Asegúrate de que los qr_codes estén cargados
  useEffect(() => {
    if (!store.qr_codes) {
      actions.loadQrCodes(); // Cargar los códigos QR si no están disponibles en el store
    }
  }, [store.qr_codes]);

  // Función para ver más detalles del código QR
  const handleVerContacto = (id) => {
    navigate(`/qr-details/${id}`);
  };

  return (
    <div className="qr-history-container">
      <NavbarHeader prevLocation={location.state?.from} />
      <div className="qr-history-content">
        <h1>Historial de Códigos QR</h1>
        <p>Esta es la página del historial de códigos QR</p>

        {/* Mapeamos los qr_codes y mostramos las tarjetas UserQrCard */}
        <ul className="list-group">
          {store.qr_codes && store.qr_codes.length > 0 ? (
            store.qr_codes.map((qrCode) => (
              <UserQrCard
                key={qrCode.id}
                id={qrCode.id}
                nombre={qrCode.nombre}
                fecha_inicio={qrCode.fecha_inicio}
                fecha_fin={qrCode.fecha_fin}
                data={qrCode.data}
                verContacto={handleVerContacto}
              />
            ))
          ) : (
            <p>No se encontraron códigos QR.</p>
          )}
        </ul>
      </div>
      <ContactBanner />
      <NavbarFooter />
    </div>
  );
};

export default QrHistory;