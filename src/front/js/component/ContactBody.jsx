import React, { useState, useEffect, useContext } from "react";
import { Container, Tab, Nav } from "react-bootstrap";
import { FaUserCircle, FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import UserContactCard from "./UserContactCard.jsx";
import UserSensitiveCard from "./UserSensitiveCard.jsx";
import "../../styles/userView/userInfo.css";

const ContactBody = () => {
  const { store, actions } = useContext(Context);
  const [activeTab, setActiveTab] = useState("0");
  const navigate = useNavigate();

  const contact = store.contact || [];
  const sensitiveData = store.sensitive_data || [];

  useEffect(() => {
    if (contact && contact.length > 0) {
      setActiveTab("0"); // Establecer la primera pestaña activa si los contactos están disponibles
    }
  }, [contact]);

  // Lógica de edición
  const handleEditForm = (contactId) => {
    const selectedContact = contact.find((contact) => contact.id === contactId);
    if (selectedContact) {
      const selectedSensitiveData = sensitiveData.filter((data) => data.contact_id === contactId);
      if (selectedSensitiveData.length > 0) {
        navigate("/userform", {
          state: {
            contactToEdit: selectedContact,
            sensitiveDataToEdit: selectedSensitiveData[0], // Pasar solo el primero
          },
        });

        // Sincroniza activeTab con el id del contacto
        setActiveTab(contactId);
      } else {
        navigate("/userform", {
          state: {
            contactToEdit: selectedContact,
            sensitiveDataToEdit: null,
          },
        });

        // Sincroniza activeTab con el id del contacto
        setActiveTab(contactId);
      }
    }
  };

  // Lógica de eliminación
  const handleDeleteContact = async () => {
    const contactId = contact[activeTab]?.id;
    if (contactId) {
      const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este contacto?");
      if (confirmDelete) {
        await actions.deleteContact(contactId);
        await actions.deleteSensitiveData(contactId);
        actions.loadContacts();  // Recargamos los contactos
        actions.loadSensitiveData();  // Recargamos los datos sensibles
      }
    }
  };

  // Lógica de creación
  const handleCreateContact = () => {
    navigate("/userform", {
      state: {
        contactToEdit: null,  // Campos vacíos para crear un nuevo contacto
        sensitiveDataToEdit: null,  // Campos vacíos para crear datos sensibles
      },
    });
  };

  // Ordenar contactos colocando el admin primero
  const adminContact = contact.find((contact) => contact.is_admin);
  const otherContacts = contact.filter((contact) => !contact.is_admin);
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
                {/* ContactCard */}
                <UserContactCard
                  id={contact.id}
                  imageUrl={contact.imageUrl || "https://via.placeholder.com/50"}
                  nombre={contact.nombre}
                  primer_apellido={contact.primer_apellido}
                  segundo_apellido={contact.segundo_apellido}
                  telefono_movil={contact.telefono_movil}
                  email={contact.email}
                />

                {/* Si el contacto tiene datos sensibles, mostrar UserSensitiveCard */}
                {sensitiveData
                  .filter((data) => data.contact_id === contact.id)
                  .map((sensitiveData, sensitiveIndex) => (
                    <UserSensitiveCard
                      key={sensitiveIndex}
                      id={sensitiveData.contact_id}
                      nif_tipo={sensitiveData.nif_tipo}
                      nif_numero={sensitiveData.nif_numero}
                      nif_country={sensitiveData.nif_country}
                    />
                  ))}
              </Tab.Pane>
            ))}
          </Tab.Content>
        </Tab.Container>

        {/* Botones de Crear, Editar y Borrar */}
        <div className="d-flex justify-content-center mt-3">
          {/* Botón Crear */}
          <button className="create-contact-btn" onClick={handleCreateContact}>
            <FaPlus className="plus-icon" />
          </button>

          {/* Botón Editar - Solo aparece cuando hay un contacto seleccionado */}
          {contact[activeTab] && (
            <button className="edit-contact-btn" onClick={() => handleEditForm(contact[activeTab].id)}>
              <FaEdit className="edit-icon" />
            </button>
          )}

          {/* Botón Borrar - Solo aparece cuando hay un contacto seleccionado */}
          {contact[activeTab] && (
            <button className="delete-contact-btn" onClick={handleDeleteContact}>
              <FaTrashAlt className="delete-icon" />
            </button>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ContactBody;