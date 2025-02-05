import React, { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import NavbarHeader from "../component/NavbarHeader.jsx";
import ContactBanner from "../component/ContactBanner.jsx";
import NavbarFooter from "../component/NavbarFooter.jsx";
import "../../styles/qrView/qrhistory.css";

const QrHistory = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="qr-history-container">
      <NavbarHeader prevLocation={location.state?.from} />
      <div className="qr-history-content">
        <h1>Historial de Códigos QR</h1>
        <p>Esta es la página del historial de códigos QR</p>
      </div>
      <ContactBanner />
      <NavbarFooter />
    </div>
  );
};

export default QrHistory;