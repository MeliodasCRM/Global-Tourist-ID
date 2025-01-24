import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Card, Tab, Nav } from "react-bootstrap"; 
import { FaArrowLeft } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom"; 
import '../../styles/userForm.css'; 

export const UserForm = ({ onSave, isEditing, isNew, user }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    telefono_movil: "",
    telefono_fijo: "",
    email: "",
  });

  const navigate = useNavigate(); 

  // Al cargar el componente, precargamos los datos si estamos editando
  useEffect(() => {
    if (isEditing && user) {
      setFormData(user); 
    } else if (isNew) {
      setFormData({
        nombre: "",
        primer_apellido: "",
        segundo_apellido: "",
        telefono_movil: "",
        telefono_fijo: "",
        email: "",
      });
    }
  }, [isEditing, user, isNew]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Llamamos a la función onSave pasada como prop
    if (onSave) {
      onSave(formData); // Pasamos formData a la función onSave
    } else {
      console.error("onSave no está definido");
    }
  };

  const handleBack = () => {
    navigate("/userInfo");
  };

  return (
    <div className="user-form-container">
      <header className="user-navbar fixed-top">
        <Button variant="link" className="back-button" onClick={handleBack}>
          <FaArrowLeft size={20} />
        </Button>
        <h1 className="m-0">{`Datos del Usuario`}</h1>
      </header>

      <Tab.Container id="left-tabs-example" defaultActiveKey="contactInfo" activeKey="contactInfo">
        <Nav variant="underline" className="mt-5 d-flex justify-content-center">
          <Nav.Item className="flex-grow-1">
            <Nav.Link eventKey="contactInfo" className="text-center">Datos Contacto</Nav.Link>
          </Nav.Item>
          <Nav.Item className="flex-grow-1">
            <Nav.Link eventKey="sensitiveInfo" className="text-center">Datos Sensibles</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="contactInfo">
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Datos Contacto</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col sm={12} md={12}>
                      <Form.Group controlId="nombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="primer_apellido">
                        <Form.Label>Primer Apellido</Form.Label>
                        <Form.Control
                          type="text"
                          name="primer_apellido"
                          value={formData.primer_apellido}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="segundo_apellido">
                        <Form.Label>Segundo Apellido</Form.Label>
                        <Form.Control
                          type="text"
                          name="segundo_apellido"
                          value={formData.segundo_apellido}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="telefono_movil">
                        <Form.Label>Teléfono Móvil</Form.Label>
                        <Form.Control
                          type="text"
                          name="telefono_movil"
                          value={formData.telefono_movil}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="telefono_fijo">
                        <Form.Label>Teléfono Fijo</Form.Label>
                        <Form.Control
                          type="text"
                          name="telefono_fijo"
                          value={formData.telefono_fijo}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={12} md={12}>
                      <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button variant="primary" type="submit" className="mt-3">
                    {isEditing ? "Actualizar Contacto" : "Guardar Contacto"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Tab.Pane>

          <Tab.Pane eventKey="sensitiveInfo">
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Datos Sensibles</Card.Title>
                {/* Campos de datos sensibles */}
                <Button variant="primary" type="submit" className="mt-3">
                  {isEditing ? "Actualizar Datos Sensibles" : "Guardar Datos Sensibles"}
                </Button>
              </Card.Body>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default UserForm;