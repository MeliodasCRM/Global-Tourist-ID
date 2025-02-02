import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";

const SensitiveDataForm = ({ sensitiveData, setSensitiveData }) => {
  const [formData, setFormData] = useState({
    nif_tipo: "DNI",  // Valor por defecto
    nif_numero: "",
    nif_country: "",
  });

  useEffect(() => {
    if (sensitiveData) {
      setFormData(sensitiveData);
    }
  }, [sensitiveData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    setSensitiveData(updatedData);
  };

  return (
    <div className="sensitive-data-form-container">
      <Form>
        <Row className="mb-3">
          <Col sm={6}>
            <Form.Group controlId="nif_tipo">
              <Form.Label>Tipo de Documento</Form.Label>
              <Form.Select name="nif_tipo" value={formData.nif_tipo} onChange={handleChange} required>
                <option value="DNI">DNI</option>
                <option value="TIE">TIE</option>
                <option value="Pasaporte">Pasaporte</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col sm={6}>
            <Form.Group controlId="nif_numero">
              <Form.Label>Número de Documento</Form.Label>
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

        <Row className="mb-3">
          <Col sm={12}>
            <Form.Group controlId="nif_country">
              <Form.Label>País de Expedición</Form.Label>
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
      </Form>
    </div>
  );
};

export default SensitiveDataForm;