import React, { useContext, useState } from "react";
import { Dropdown } from "react-bootstrap"; // Importa react-bootstrap Dropdown
import { FaUser, FaBriefcase, FaQrcode, FaBuilding, FaCog } from "react-icons/fa"; // Usamos react-icons
import '../../styles/userHome.css'; // Asegúrate de tener tus estilos específicos
import { Context } from "../store/appContext";

const UserHome = () => {
  const [showDropdown, setShowDropdown] = useState(false);  // Maneja el estado del dropdown
  const { actions } = useContext(Context);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);  // Alternar el estado de visibilidad del dropdown
  };

  const handleLogOut = () => {
    actions.logout();
  }

  return (
    <div className="user-home">
      {/* Header fijo al top con Bootstrap */}
      <header className="user-navbar fixed-top">
        <button className="back-button">&#8592; Back</button>
        <h1 className="m-0">Home User</h1>

        {/* Icono como botón de perfil con el dropdown */}
        <div className="d-flex align-items-center ms-auto">
          <Dropdown align="start" show={showDropdown} onToggle={handleDropdownToggle}>
            <Dropdown.Toggle variant="link" id="dropdown-custom-components" className="profile-button">
              <FaCog size={30} color="white" /> {/* Icono dentro del botón */}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as="button">Account</Dropdown.Item>
              <Dropdown.Item as="button">Settings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item as="button" onClick={handleLogOut}>Log Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>

      <main className="user-main pt-5 mt-3">
        {/* Código QR */}
        <div className="qr-code">
          <img src="qr-code-placeholder.jpg" alt="QR Code" className="qr-image" />
          <p>Scan to connect</p>
        </div>

        <div className="icon-container">
          <div className="icon">
            <FaUser size={40} color="#333" />
            <p>Users</p>
          </div>
          <div className="icon">
            <FaBriefcase size={40} color="#333" />
            <p>Reservas</p>
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