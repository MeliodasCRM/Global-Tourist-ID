import React, { useState, useEffect } from "react";
import { Button, Tab, Nav, Card, Form, Row, Col } from "react-bootstrap"; // Importamos react-bootstrap
import { FaArrowLeft } from "react-icons/fa"; // Icono de regresar
import { useNavigate } from "react-router-dom"; // Para la navegación
import '../../styles/userForm.css'; // Asegúrate de que este archivo CSS esté correctamente enlazado

export const UserForm = ({ user, onSave, isEditing }) => {
  const [key, setKey] = useState("contactInfo"); // Estado para las pestañas
  const [formData, setFormData] = useState({
    nombres: "",
    primer_apellido: "",
    segundo_apellido: "",
    nacionalidad: "",
    fecha_nacimiento: "",
    direccion: "",
    localidad: "",
    pais: "",
    email: "",
    telefono_movil: "",
    telefono_fijo: "",
    nif_tipo: "",
    nif_nunero: "",
    nif_country: "",
    firmas: "",
    medio_pago_tipo: "",
    medio_pago_nro: "",
    medio_pago_expira: "",
    fecha_pago: "",
  });

  const navigate = useNavigate(); // Usamos navigate para redirigir

  // Precargar los datos del usuario si estamos editando
  useEffect(() => {
    if (isEditing) {
      setFormData(isEditing);
    }
  }, [isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Llamar a onSave para guardar los datos
  };

  const handleBack = () => {
    setFormData({
      nombres: "",
      primer_apellido: "",
      segundo_apellido: "",
      nacionalidad: "",
      fecha_nacimiento: "",
      direccion: "",
      localidad: "",
      pais: "",
      email: "",
      telefono_movil: "",
      telefono_fijo: "",
      nif_tipo: "",
      nif_nunero: "",
      nif_country: "",
      firmas: "",
      medio_pago_tipo: "",
      medio_pago_nro: "",
      medio_pago_expira: "",
      fecha_pago: "",
    }); // Resetear el formulario
    navigate("/userhome"); // Redirigir al home de usuario
  };

  return (
    <div className="user-form-container">
      {/* Header con botón de regreso */}
      <header className="user-navbar fixed-top">
        <Button variant="link" className="back-button" onClick={handleBack}>
          <FaArrowLeft size={20} />
        </Button>
        <h1 className="m-0">{`Datos del Usuario`}</h1>
      </header>

      {/* Pestañas debajo del header con Underline */}
      <Tab.Container id="left-tabs-example" defaultActiveKey="contactInfo" activeKey={key} onSelect={(k) => setKey(k)}>
        <Nav variant="underline" className="mt-5 d-flex justify-content-center">
          <Nav.Item className="flex-grow-1">
            <Nav.Link eventKey="contactInfo" className="text-center">Datos Contacto</Nav.Link>
          </Nav.Item>
          <Nav.Item className="flex-grow-1">
            <Nav.Link eventKey="sensitiveInfo" className="text-center">Datos Sensibles</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          {/* Pestaña Datos Contacto */}
          <Tab.Pane eventKey="contactInfo">
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Datos Contacto</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col sm={12} md={12}>
                      <Form.Group controlId="nombres">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                          type="text"
                          name="nombres"
                          value={formData.nombres}
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
                      <Form.Group controlId="nacionalidad">
                        <Form.Label>Nacionalidad</Form.Label>
                        <Form.Control
                          type="text"
                          name="nacionalidad"
                          value={formData.nacionalidad}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="fecha_nacimiento">
                        <Form.Label>Fecha de Nacimiento</Form.Label>
                        <Form.Control
                          type="date"
                          name="fecha_nacimiento"
                          value={formData.fecha_nacimiento}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={12} md={12}>
                      <Form.Group controlId="direccion">
                        <Form.Label>Dirección</Form.Label>
                        <Form.Control
                          type="text"
                          name="direccion"
                          value={formData.direccion}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="localidad">
                        <Form.Label>Localidad</Form.Label>
                        <Form.Control
                          type="text"
                          name="localidad"
                          value={formData.localidad}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="pais">
                        <Form.Label>País</Form.Label>
                        <Form.Control
                          type="text"
                          name="pais"
                          value={formData.pais}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={12} md={6}>
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
                    <Col sm={12} md={6}>
                      <Form.Group controlId="telefono_movil">
                        <Form.Label>Teléfono Móvil</Form.Label>
                        <Form.Control
                          type="text"
                          name="telefono_movil"
                          value={formData.telefono_movil}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
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

                  {/* Botón Guardar fuera de las pestañas */}
                  <Button variant="primary" type="submit" className="mt-3">
                    {isEditing ? "Actualizar Contacto" : "Guardar Contacto"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* Pestaña Datos Sensibles */}
          <Tab.Pane eventKey="sensitiveInfo">
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Datos Sensibles</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="nif_tipo">
                        <Form.Label>Tipo NIF</Form.Label>
                        <Form.Control
                          type="text"
                          name="nif_tipo"
                          value={formData.nif_tipo}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="nif_nunero">
                        <Form.Label>Número NIF</Form.Label>
                        <Form.Control
                          type="text"
                          name="nif_nunero"
                          value={formData.nif_nunero}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="nif_country">
                        <Form.Label>País NIF</Form.Label>
                        <Form.Control
                          type="text"
                          name="nif_country"
                          value={formData.nif_country}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="firmas">
                        <Form.Label>Firmas</Form.Label>
                        <Form.Control
                          type="text"
                          name="firmas"
                          value={formData.firmas}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="medio_pago_tipo">
                        <Form.Label>Tipo Medio de Pago</Form.Label>
                        <Form.Control
                          type="text"
                          name="medio_pago_tipo"
                          value={formData.medio_pago_tipo}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="medio_pago_nro">
                        <Form.Label>Número Medio de Pago</Form.Label>
                        <Form.Control
                          type="text"
                          name="medio_pago_nro"
                          value={formData.medio_pago_nro}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="medio_pago_expira">
                        <Form.Label>Fecha de Expiración</Form.Label>
                        <Form.Control
                          type="date"
                          name="medio_pago_expira"
                          value={formData.medio_pago_expira}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col sm={12} md={6}>
                      <Form.Group controlId="fecha_pago">
                        <Form.Label>Fecha de Pago</Form.Label>
                        <Form.Control
                          type="date"
                          name="fecha_pago"
                          value={formData.fecha_pago}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button variant="primary" type="submit" className="mt-3">
                    {isEditing ? "Actualizar Datos Sensibles" : "Guardar Datos Sensibles"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default UserForm;