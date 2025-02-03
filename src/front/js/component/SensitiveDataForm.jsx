import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";

const SensitiveDataForm = ({ sensitiveData, setSensitiveData }) => {
  const [formData, setFormData] = useState({
    nif_tipo: "",
    nif_numero: "",
    nif_country: "",
  });

  // Cargar los datos sensibles cuando cambian las props
  useEffect(() => {
    if (sensitiveData) {
      setFormData({
        nif_tipo: sensitiveData.nif_tipo || "",
        nif_numero: sensitiveData.nif_numero || "",
        nif_country: sensitiveData.nif_country || "",
      });
    }
  }, [sensitiveData]);

  // Manejar el cambio en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Actualizar el estado global con los nuevos valores
    setSensitiveData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <h4>Datos Sensibles</h4>
      <Form>
        {/* NIF Tipo */}
        <Form.Group controlId="nif_tipo">
          <Form.Label>NIF Tipo</Form.Label>
          <Form.Control
            type="text"
            name="nif_tipo"
            value={formData.nif_tipo}
            onChange={handleChange}
            placeholder="Introduce el tipo de NIF"
          />
        </Form.Group>

        {/* NIF Número */}
        <Form.Group controlId="nif_numero">
          <Form.Label>NIF Número</Form.Label>
          <Form.Control
            type="text"
            name="nif_numero"
            value={formData.nif_numero}
            onChange={handleChange}
            placeholder="Introduce el número de NIF"
          />
        </Form.Group>

        {/* NIF País */}
        <Form.Group controlId="nif_country">
          <Form.Label>NIF País</Form.Label>
          <Form.Control
            type="text"
            name="nif_country"
            value={formData.nif_country}
            onChange={handleChange}
            placeholder="Introduce el país del NIF"
          />
        </Form.Group>

        {/* Botón de Guardar */}
        <Button variant="primary" onClick={() => setSensitiveData(formData)}>
          Guardar Datos
        </Button>
      </Form>
    </div>
  );
};

export default SensitiveDataForm;