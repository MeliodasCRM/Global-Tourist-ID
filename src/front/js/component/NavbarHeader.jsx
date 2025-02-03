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

  const handleBack = () => {
    if (prevLocation) {
      navigate(prevLocation);
    } else {
      navigate(-1);
    }
  };

  const handleDropdownToggle = (isOpen) => {
    setShowDropdown(isOpen);
  };

  const handleLogOut = () => {
    console.log("Cerrando Sesión");
    actions.logout();
    navigate("/login");
  };

    return (
      <div className="navbar-header">
        <Container className="header-content">
          <button className="icon-back" onClick={handleBack}>
            <FaArrowLeft />
          </button>
          <h2 className="header-title">Contactos</h2>
          <div className="d-flex align-items-center ms-auto">
            <Dropdown align="end" show={showDropdown} onToggle={handleDropdownToggle}>
              <Dropdown.Toggle variant="link" id="dropdown-custom-components" className="menu-button">
                <FaBars/>
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