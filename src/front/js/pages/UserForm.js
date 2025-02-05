import React, { useState, useEffect, useContext } from "react";
import { Tab, Nav, Button, Container } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { Context } from "../store/appContext";
import NavbarHeader from "../component/NavbarHeader.jsx";
import UserContactForm from "../component/UserContactForm.jsx";
import SensitiveDataForm from "../component/SensitiveDataForm.jsx";
import "../../styles/userForm.css";

const UserForm = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const [key, setKey] = useState("contact");

  // Separate states for contact data and edit mode
  const [formData, setFormData] = useState({
    nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    telefono_movil: "",
    telefono_fijo: "",
    email: "",
    sexo: "",
    fecha_nacimiento: "",
    nacionalidad: "",
    direccion: "",
    localidad: "",
    pais: ""
  });

  const [sensitiveFormData, setSensitiveFormData] = useState({
    nif_tipo: "",
    nif_numero: "",
    nif_country: ""
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (location.state?.contactToEdit) {
      setFormData(location.state.contactToEdit);
      setSensitiveFormData(location.state.sensitiveDataToEdit || {});
      setIsEditing(true);
    } else {
      setFormData({
        nombre: "",
        primer_apellido: "",
        segundo_apellido: "",
        telefono_movil: "",
        telefono_fijo: "",
        email: "",
        sexo: "",
        fecha_nacimiento: "",
        nacionalidad: "",
        direccion: "",
        localidad: "",
        pais: ""
      });
      setSensitiveFormData({
        nif_tipo: "",
        nif_numero: "",
        nif_country: ""
      });
      setIsEditing(false);
    }
  }, [location.state]);

  const handleSave = async () => {
    if (!store.user) {
      console.error("El usuario no está cargado correctamente.");
      return;
    }

    try {
      if (isEditing) {
        await actions.updateContact(formData.id, formData);
        if (sensitiveFormData) {
          await actions.updateSensitiveData(formData.id, sensitiveFormData);
        }
      } else {
        const newContact = await actions.createContact(formData);
        if (newContact && sensitiveFormData) {
          await actions.createSensitiveData(newContact.id, sensitiveFormData);
        }
      }
      navigate("/userinfo");
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <div className="user-form">
      <div className="user-form-header">
        <NavbarHeader prevLocation={location.state?.from} />
      </div>

      <div className="user-form-tabs">
        <Tab.Container activeKey={key} onSelect={(k) => setKey(k)}>
          <Nav variant="pills" className="tabs-row">
            <Nav.Item>
              <Nav.Link eventKey="contact">Datos de Contacto</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="sensitive">Datos Sensibles</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="contact">
              <UserContactForm
                contactData={formData}
                setContactForm={setFormData}
                isEditing={isEditing}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="sensitive">
              <SensitiveDataForm
                sensitiveData={sensitiveFormData}
                setSensitiveData={setSensitiveFormData}
              />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>

      <Container className="button-container">
        <Button
          className={isEditing ? "update-button" : "create-button"}
          onClick={handleSave}
          >
          {isEditing ? "Actualizar" : "Guardar"}
        </Button>
      </Container>
    </div>
  );
};

export default UserForm;