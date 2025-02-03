import React, { useState, useEffect, useContext } from "react";
import { Container, Tab, Nav } from "react-bootstrap";
import { FaUserCircle, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import UserContactCard from "./UserContactCard.jsx";
import "../../styles/userView/userInfo.css";

const ContactBody = () => {
  const { store, actions } = useContext(Context);
  const [activeTab, setActiveTab] = useState("0");
  const navigate = useNavigate();

  useEffect(() => {
    if (store.contact && store.contact.length > 0) {
      setActiveTab("0");
    }
  }, [store.contact]);

  /** 📌 Crear nuevo contacto */
  const handleCreateContact = () => {
    navigate("/userform");
  };

  /** 📌 Editar contacto */
  const handleEditContact = (contactId) => {
    const selectedContact = store.contact.find(contact => contact.id === contactId);
    if (selectedContact) {
      navigate("/userform", { state: { contactToEdit: selectedContact } });
    } else {
      console.error("❌ Contacto no encontrado para edición.");
    }
  };

  /** 📌 Eliminar contacto */
  const handleDeleteContact = async (contactId) => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este contacto?");
    if (confirmDelete) {
      await actions.deleteContact(contactId);
      actions.loadContacts();
    }
  };

  // 🚀 Si no hay contactos, mostrar mensaje + botón de crear contacto
  if (!store.contact || store.contact.length === 0) {
    return (
      <Container className="body-content">
        <div className="no-data-card">
          <h4>No hay contactos disponibles</h4>
          <p>Por favor, cree un contacto...</p>
        </div>

        <div className="d-flex justify-content-center mt-3">
          <button className="create-contact-btn" onClick={handleCreateContact}>
            <FaPlus className="plus-icon" />
          </button>
        </div>
      </Container>
    );
  }

  // 🚀 Ordenar contactos colocando el admin primero
  const adminContact = store.contact.find(contact => contact.is_admin);
  const otherContacts = store.contact.filter(contact => !contact.is_admin);
  const orderedContacts = adminContact ? [adminContact, ...otherContacts] : [...otherContacts];

  return (
    <div className="contact-body">
      <Container className="body-content">
        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
          <Nav variant="pills" className="contact-tabs">
            {orderedContacts.map((contact, index) => (
              <Nav.Item key={index}>
                <Nav.Link eventKey={index.toString()} className="contact-tab">
                  <FaUserCircle size={24} /> <span className="tab-text">{contact.nombre}</span>
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          <Tab.Content>
            {orderedContacts.map((contact, index) => (
              <Tab.Pane key={index} eventKey={index.toString()}>
                <UserContactCard
                  id={contact.id}
                  imageUrl={contact.imageUrl || "https://via.placeholder.com/50"}
                  nombre={contact.nombre}
                  primer_apellido={contact.primer_apellido}
                  segundo_apellido={contact.segundo_apellido}
                  sexo={contact.sexo}
                  nacionalidad={contact.nacionalidad}
                  fecha_nacimiento={contact.fecha_nacimiento}
                  direccion={contact.direccion}
                  localidad={contact.localidad}
                  pais={contact.pais}
                  email={contact.email}
                  telefono_movil={contact.telefono_movil}
                  telefono_fijo={contact.telefono_fijo}
                  is_admin={contact.is_admin}
                  user_id={contact.user_id}
                  handleEditContact={() => handleEditContact(contact.id)}
                  handleDeleteContact={() => handleDeleteContact(contact.id)}
                />
              </Tab.Pane>
            ))}
          </Tab.Content>
        </Tab.Container>

        {/* 📌 Botón de Crear Contacto (colocado correctamente) */}
        <div className="d-flex justify-content-center mt-3">
          <button className="create-contact-btn" onClick={handleCreateContact}>
            <FaPlus className="plus-icon" />
          </button>
        </div>
      </Container>
    </div>
  );
};

export default ContactBody;