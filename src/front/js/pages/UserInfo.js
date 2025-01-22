import React, { useState } from "react";
import { Button, Tab, Nav, Accordion, Card, Form } from "react-bootstrap"; // Importamos react-bootstrap
import { FaArrowLeft, FaPlus } from "react-icons/fa"; // Icono de flecha izquierda y más
import { useNavigate } from "react-router-dom"; // Para navegación
import '../../styles/userInfo.css'; // Asegúrate de que este archivo CSS esté importado correctamente
import { Link } from 'react-router-dom';

const UserInfo = () => {
  const [key, setKey] = useState("user01"); // Estado para las pestañas
  const navigate = useNavigate(); // Usamos navigate para redirigir
  const [mainContact, setMainContact] = useState(null); // Alamaceno el contacto principal

  const handleBack = () => {
    navigate("/userhome"); // Redirige al home de usuario
  };

  return (
    <div className="user-info">
      {/* Header con botón de regreso y título centrado */}
      <header className="user-navbar fixed-top">
        <Button variant="link" className="back-button" onClick={handleBack}>
          <FaArrowLeft size={20} color="white" />
        </Button>
        <h1 className="user-title">User Info</h1>
        <Link to="/userForm">
          <Button variant="success" className="profile-button">
            <FaPlus size={20} color="white" />
          </Button>
        </Link>
      </header>

      {/* Pestañas debajo del header con Underline y separación de 5px */}
      <Tab.Container id="left-tabs-example" defaultActiveKey="user01" activeKey={key} onSelect={(k) => setKey(k)}>
        <Nav variant="underline" className="mt-1 d-flex justify-content-center">
          <Nav.Item className="flex-grow-1">
            <Nav.Link eventKey="user01" className="text-center">Contacto 01</Nav.Link>
          </Nav.Item>
          <Nav.Item className="flex-grow-1">
            <Nav.Link eventKey="user02" className="text-center">Contacto 02</Nav.Link>
          </Nav.Item>
          <Nav.Item className="flex-grow-1">
            <Nav.Link eventKey="user03" className="text-center">Contacto 03</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="user01">
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Contact Info</Accordion.Header>
                <Accordion.Body>
                  Nombre: Jorge Mauricio Sonzogni Novo<br />
                  Teléfono: +34 691 120 553 || +34 789 987 987<br />
                  Email: msonzogni@gmail.com
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Sensitive Info</Accordion.Header>
                <Accordion.Body>
                  DNI: 55555555-P<br />
                  Banco: SANTANDER BANK
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>Reserves List</Accordion.Header>
                <Accordion.Body>
                  Viaje a Barcelona<br />
                  Del 01/01/25 al 15/01/25
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            {/* Campo de fecha y botones */}
            <Form.Group className="mb-3">
              <Form.Label>QR Expiration Date</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
            <div className="buttons-container">
              <Button variant="primary" className="me-2">Generate QR</Button>
              <Button variant="primary">Generate All</Button>
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="user02">
            <h4>Información para el Usuario 02</h4>
          </Tab.Pane>
          <Tab.Pane eventKey="user03">
            <h4>Información para el Usuario 03</h4>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Footer */}
      <footer className="user-footer fixed-bottom">
        <img src="banner.jpg" alt="Banner Publicitario" className="banner-image" />
      </footer>
    </div>
  );
};

export default UserInfo;