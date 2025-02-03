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
  const [contactToEdit, setContactToEdit] = useState(location.state?.contactToEdit || null);
  const [sensitiveData, setSensitiveData] = useState(location.state?.sensitiveDataToEdit || null);

  useEffect(() => {
    if (store.user && store.user.id) {
      actions.loadContacts();
    }
  }, [store.user]);

  const handleSave = async () => {
    if (!store.user) {
      console.error("El usuario no está cargado correctamente.");
      return;
    }

    // Guardar datos de contacto
    if (contactToEdit) {
      await actions.updateContact(contactToEdit.id, contactToEdit);
    } else {
      const newContact = await actions.createContact(contactToEdit);
      if (newContact) {
        setContactToEdit(newContact);
      }
    }

    // Guardar datos sensibles
    if (sensitiveData) {
      await actions.updateSensitiveData(contactToEdit?.id, sensitiveData);
    }

    navigate("/userinfo");
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
                contactData={contactToEdit}
                isEditing={!!contactToEdit}
                onChange={(data) => setContactToEdit(data)}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="sensitive">
              <SensitiveDataForm
                sensitiveData={sensitiveData}
                setSensitiveData={setSensitiveData}
              />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>

      <Container className="button-container">
        <Button className="update-button" onClick={handleSave}>
          Actualizar
        </Button>
      </Container>
    </div>
  );
};

export default UserForm;