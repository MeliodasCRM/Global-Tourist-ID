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

  return (
    <div className="user-home-container">
      <NavbarHeader prevLocation={location.state?.from} />
      <div className="user-home-content">
        <h1>Home del Usuario</h1>
        <p>Esta es la página del último QR Generado</p>
      </div>
      <ContactBanner />
      <NavbarFooter />
    </div>
  );
};

export default UserHome;