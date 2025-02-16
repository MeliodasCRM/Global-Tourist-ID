import React, { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Container, Row } from "react-bootstrap";
import { FaQrcode } from "react-icons/fa";
import NavbarHeader from "../component/NavbarHeader.jsx";
import UserQrCard from "../component/UserQrCard.jsx";
import ContactBanner from "../component/Banner.jsx";
import NavbarFooter from "../component/NavbarFooter.jsx";
import "../../styles/qrView/qrhistory.css";

const QrHistory = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (store.qr_codes.length === 0) {
      actions.loadQrCodes();
    }
  }, [store.qr_codes, actions]);

  const handleVerContacto = (id) => {
    navigate(`/qr-details/${id}`);
  };

  const handleDeleteQR = (id) => {
    actions.deleteQrCode(id);
  };

  const NoQrMessage = () => {
    return (
      <div className="no-qr-container">
        <FaQrcode className="qr-icon" />
        <h2>¡No hay códigos QR!</h2>
        <p>Debes generar un QR para ver el historial</p>
        <button 
          className="generate-qr-btn"
          onClick={() => navigate('/generate')}
        >
          Generar QR
        </button>
      </div>
    );
  };

  return (
    <div className="view-container">
      <Container fluid className="d-flex flex-column p-0 m-0 h-100">
        <Row className="view-header sticky-top g-0">
          <NavbarHeader prevLocation={location.state?.from} />
        </Row>

        <Row className="view-body g-0">
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
            <NoQrMessage />
          )}
        </Row>

        <Row className="view-banner m-0 g-0">
          <ContactBanner />
        </Row>

        <Row className="view-footer m-0 g-0">
          <NavbarFooter />
        </Row>
      </Container>
    </div>
  );
};

export default QrHistory;