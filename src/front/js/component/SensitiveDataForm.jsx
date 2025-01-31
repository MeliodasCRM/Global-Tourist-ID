import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

// Asumimos que el tipo NIF es un enumerado, por lo que se podría definir un array de opciones
const nifTypes = ["DNI", "NIE", "Pasaporte"];

const SensitiveDataForm = ({ contactData, isEditing, onSave }) => {
  const [formData, setFormData] = useState({
    nif_tipo: "",
    nif_numero: "",
    nif_country: "",
    contact_id: contactData ? contactData.id : null, // Aseguramos que el contact_id esté presente si se edita
  });

  useEffect(() => {
    if (isEditing && contactData) {
      setFormData({
        nif_tipo: contactData.sensitive_data ? contactData.sensitive_data.nif_tipo : "",
        nif_numero: contactData.sensitive_data ? contactData.sensitive_data.nif_numero : "",
        nif_country: contactData.sensitive_data ? contactData.sensitive_data.nif_country : "",
        contact_id: contactData.id, // Este valor siempre debe estar presente al editar
      });
    }
  }, [isEditing, contactData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData); // Llamamos a la función onSave cuando el formulario es enviado
    }
  };

  return (
    <div style={{ maxWidth: "375px", margin: "0 auto" }}>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col sm={12}>
            <Form.Group controlId="nif_tipo">
              <Form.Label>Tipo de NIF</Form.Label>
              <Form.Control
                as="select"
                name="nif_tipo"
                value={formData.nif_tipo}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un tipo de NIF</option>
                {nifTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col sm={12}>
            <Form.Group controlId="nif_numero">
              <Form.Label>Número de NIF</Form.Label>
              <Form.Control
                type="text"
                name="nif_numero"
                value={formData.nif_numero}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col sm={12}>
            <Form.Group controlId="nif_country">
              <Form.Label>País del NIF</Form.Label>
              <Form.Control
                type="text"
                name="nif_country"
                value={formData.nif_country}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit" className="mt-3">
          {isEditing ? "Actualizar Datos Sensibles" : "Guardar Datos Sensibles"}
        </Button>
      </Form>
    </div>
  );
};

export default SensitiveDataForm;