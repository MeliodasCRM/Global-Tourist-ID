import React, { useState } from "react";
import { Button, Tab, Nav, Card, Form } from "react-bootstrap"; // Importamos react-bootstrap
import { FaPlus } from "react-icons/fa"; // Icono de más
import { useNavigate } from "react-router-dom"; // Para navegación
import '../../styles/userInfo.css'; // Asegúrate de que este archivo CSS esté importado correctamente
import { Link } from 'react-router-dom';

const UserInfo = () => {
  const [key, setKey] = useState("user01"); // Estado para las pestañas
  const navigate = useNavigate(); // Usamos navigate para redirigir

  const handleBack = () => {
    navigate("/userhome"); // Redirige al home de usuario
  };

  return (
    <div className="user-info">
      {/* Header con botón de regreso y botón de perfil */}
      <header className="user-navbar fixed-top">
        <Button variant="link" className="back-button" onClick={handleBack}>&#8592; Back</Button>
        <h1 className="m-0">User Info</h1>
       <Link to="/userForm">
        <Button variant="success" className="profile-button">
          <FaPlus size={20} color="white" />
        </Button></Link>
      </header>

      {/* Pestañas debajo del header con Underline */}
      <Tab.Container id="left-tabs-example" defaultActiveKey="user01" activeKey={key} onSelect={(k) => setKey(k)}>
        <Nav variant="underline" className="mt-5 d-flex justify-content-center">
          <Nav.Item className="flex-grow-1">
            <Nav.Link eventKey="user01" className="text-center">User 01</Nav.Link>
          </Nav.Item>
          <Nav.Item className="flex-grow-1">
            <Nav.Link eventKey="user02" className="text-center">User 02</Nav.Link>
          </Nav.Item>
          <Nav.Item className="flex-grow-1">
            <Nav.Link eventKey="user03" className="text-center">User 03</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="user01">
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Contact Info</Card.Title>
                <Card.Text>
                  Nombre: Jorge Mauricio Sonzogni Novo<br />
                  Teléfono: +34 691 120 553 || +34 789 987 987<br />
                  Email: msonzogni@gmail.com
                </Card.Text>
              </Card.Body>
            </Card>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Sensitive Info</Card.Title>
                <Card.Text>
                  DNI: 55555555-P<br />
                  Banco: SANTANDER BANK
                </Card.Text>
              </Card.Body>
            </Card>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Reserves List</Card.Title>
                <Card.Text>
                  Viaje a Barcelona<br />
                  Del 01/01/25 al 15/01/25
                </Card.Text>
              </Card.Body>
            </Card>
            {/* Campo de fecha y botones */}
            <Form.Group className="mb-3">
              <Form.Label>Card Expiration Date</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
            <Button variant="primary" className="me-2">Generate QR</Button>
            <Button variant="primary">Generate All</Button>
            <Button variant="primary" className="mt-3" onClick={() => navigate("/reservas")}>Proximas Reservas</Button>
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