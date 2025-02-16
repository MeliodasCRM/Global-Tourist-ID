import React, { useContext, useState } from "react";
import { Container, Dropdown } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBars } from "react-icons/fa";
import { Context } from "../store/appContext";
import '../../styles/userView/navbarHeader.css';

const NavbarHeader = ({ prevLocation }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const { actions } = useContext(Context);
  const location = useLocation();

  // Función para manejar el retroceso
  const handleBack = () => {
    if (prevLocation) {
      navigate(prevLocation);
    } else {
      navigate(-1);
    }
  };

  // Función para manejar el toggle del dropdown
  const handleDropdownToggle = (isOpen) => {
    setShowDropdown(isOpen);
  };

  // Función para cerrar sesión
  const handleLogOut = () => {
    console.log("Cerrando Sesión");
    actions.logout();
    navigate("/login");
  };

  // Determinar el título del header según la ruta actual
  const getHeaderTitle = () => {
    switch (location.pathname) {
      case "/userhome":
        return "Inicio";
      case "/userinfo":
        return "Perfil";
      case "/generate":
        return "Generar QR";
      case "/qrhistory":
        return "Historial de QR";
      default:
        return "Inicio"; // Título por defecto
    }
  };

  return (
    <div className="navbar-header">
      <Container className="header-content">
        <button className="icon-back" onClick={handleBack}>
          <FaArrowLeft />
        </button>
        <h2 className="header-title">{getHeaderTitle()}</h2> {/* Título dinámico */}
        <div className="d-flex align-items-center ms-auto">
          <Dropdown align="end" show={showDropdown} onToggle={handleDropdownToggle}>
            <Dropdown.Toggle variant="link" id="dropdown-custom-components" className="menu-button">
              <FaBars />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as="button">Account</Dropdown.Item>
              <Dropdown.Item as="button">Settings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item as="button" onClick={handleLogOut}>Log Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </div>
  );
};

export default NavbarHeader;