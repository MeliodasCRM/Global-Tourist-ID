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
  const [sensitiveData, setSensitiveData] = useState(null);

  useEffect(() => {
    if (store.user && store.user.id) {
      actions.loadContacts();
    }
  }, [store.user]);

  useEffect(() => {
    if (location.state?.contactToEdit && !contactToEdit) {
      setContactToEdit(location.state.contactToEdit);
      actions.loadSensitiveData(location.state.contactToEdit.id).then(data => {
        setSensitiveData(data);
      });
    }
  }, [location.state?.contactToEdit]);

  const handleSave = async () => {
    if (!store.user) {
      console.error("❌ El usuario no está cargado correctamente.");
      return;
    }

    if (contactToEdit) {
      await actions.updateContact(contactToEdit.id, contactToEdit);
    } else {
      const newContact = await actions.createContact(contactToEdit);
      if (newContact) {
        setContactToEdit(newContact);
      }
    }

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