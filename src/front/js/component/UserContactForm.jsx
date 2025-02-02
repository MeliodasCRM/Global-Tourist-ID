import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";

const UserContactForm = ({ contactData, isEditing, onChange }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    sexo: "",
    nacionalidad: "",
    fecha_nacimiento: "",
    direccion: "",
    localidad: "",
    pais: "",
    email: "",
    telefono_movil: "",
    telefono_fijo: "",
    is_admin: false,
  });

  useEffect(() => {
    if (isEditing && contactData) {
      setFormData(contactData);
    } else {
      setFormData({
        nombre: "",
        primer_apellido: "",
        segundo_apellido: "",
        sexo: "",
        nacionalidad: "",
        fecha_nacimiento: "",
        direccion: "",
        localidad: "",
        pais: "",
        email: "",
        telefono_movil: "",
        telefono_fijo: "",
        is_admin: false,
      });
    }
  }, [isEditing, contactData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    onChange(updatedFormData);
  };

  return (
    <div className="user-contact-form-container">
      <Form>
        <Row className="mb-3">
          <Col sm={12}>
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

        {/* Primer y Segundo Apellido */}
        <Row className="mb-3">
          <Col sm={6}>
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
          <Col sm={6}>
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

        {/* Teléfonos */}
        <Row className="mb-3">
          <Col sm={6}>
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
          <Col sm={6}>
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

        <Row className="mb-3">
          <Col sm={6}>
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
          <Col sm={6}>
            <Form.Group controlId="sexo">
              <Form.Label>Sexo</Form.Label>
              <Form.Control
                type="text"
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={6}>
            <Form.Group controlId="fecha_nacimiento">
              <Form.Label>Fecha de Nacimiento</Form.Label>
              <Form.Control
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col sm={6}>
            <Form.Group controlId="nacionalidad">
              <Form.Label>Nacionalidad</Form.Label>
              <Form.Control
                type="text"
                name="nacionalidad"
                value={formData.nacionalidad}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Dirección */}
        <Row className="mb-3">
          <Col sm={12}>
            <Form.Group controlId="direccion">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Localidad y País */}
        <Row className="mb-3">
          <Col sm={6}>
            <Form.Group controlId="localidad">
              <Form.Label>Localidad</Form.Label>
              <Form.Control
                type="text"
                name="localidad"
                value={formData.localidad}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col sm={6}>
            <Form.Group controlId="pais">
              <Form.Label>País</Form.Label>
              <Form.Control
                type="text"
                name="pais"
                value={formData.pais}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default UserContactForm;