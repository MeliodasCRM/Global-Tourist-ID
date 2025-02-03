import React, { useState, useEffect, useContext } from "react";
import { Container, Tab, Nav } from "react-bootstrap";
import { FaUserCircle, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import UserContactCard from "./UserContactCard.jsx";
import UserSensitiveCard from "./UserSensitiveCard.jsx"; // Importamos el componente de datos sensibles
import "../../styles/userView/userInfo.css";

const ContactBody = () => {
  const { store, actions } = useContext(Context);
  const [activeTab, setActiveTab] = useState("0");
  const [contactToEdit, setContactToEdit] = useState(null);
  const [sensitiveDataToEdit, setSensitiveDataToEdit] = useState(null);
  const navigate = useNavigate();

  const contact = store.contact || [];
  const sensitiveData = store.sensitive_data || [];

  useEffect(() => {
    if (contact && contact.length > 0) {
      setActiveTab("0"); // Establecer la primera pestaña activa si los contactos están disponibles
    }
  }, [contact]);

  // Unificar las funciones de edición de contacto y datos sensibles
  const handleEditForm = async (contactId) => {
    // Buscar el contacto correspondiente
    const selectedContact = contact.find(contact => contact.id === contactId);
    if (selectedContact) {
      setContactToEdit(selectedContact);
      console.log("Contacto a editar:", selectedContact);

      // Filtrar y obtener los datos sensibles correspondientes al contacto
      const selectedSensitiveData = sensitiveData.filter(data => data.contact_id === contactId);

      if (selectedSensitiveData && selectedSensitiveData.length > 0) {
        setSensitiveDataToEdit(selectedSensitiveData[0]);  // Solo tomamos el primer dato sensible asociado
        console.log("Datos sensibles a editar:", selectedSensitiveData[0]);
      } else {
        console.error("No se encontraron datos sensibles para este contacto.");
        setSensitiveDataToEdit(null);  // No hay datos sensibles para este contacto
      }

      // Navegar a la página de edición con los datos cargados
      navigate("/userform", {
        state: {
          contactToEdit: selectedContact,
          sensitiveDataToEdit: selectedSensitiveData[0] || null,  // Solo pasamos el primero, si existe
        },
      });
    } else {
      console.error("Contacto no encontrado para edición.");
    }
  };

  const handleDeleteContact = async (contactId) => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este contacto?");
    if (confirmDelete) {
      // Primero, eliminamos el contacto
      await actions.deleteContact(contactId);

      // Luego, eliminamos los datos sensibles asociados a este contacto
      await actions.deleteSensitiveData(contactId);

      // Recargamos los contactos y los datos sensibles
      actions.loadContacts();
      actions.loadSensitiveData();
    }
  };

  // Si no hay contactos, mostrar mensaje + botón de crear contacto
  if (!store.contact || store.contact.length === 0) {
    return (
      <Container className="body-content">
        <div className="no-data-card">
          <h4>No hay contactos disponibles</h4>
          <p>Por favor, cree un contacto...</p>
        </div>

        <div className="d-flex justify-content-center mt-3">
          <button className="create-contact-btn" onClick={() => navigate("/userform")}>
            <FaPlus className="plus-icon" />
          </button>
        </div>
      </Container>
    );
  }

  // Ordenar contactos colocando el admin primero
  const adminContact = contact.find(contact => contact.is_admin);
  const otherContacts = contact.filter(contact => !contact.is_admin);
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
                  handleEditContact={() => handleEditForm(contact.id)} // Llamamos a la función unificada
                  handleDeleteContact={() => handleDeleteContact(contact.id)}
                />

                {/* Si el contacto tiene datos sensibles, mostrar UserSensitiveCard */}
                {sensitiveData
                  .filter(data => data.contact_id === contact.id)
                  .map((sensitiveData, sensitiveIndex) => (
                    <UserSensitiveCard
                      key={sensitiveIndex}
                      id={sensitiveData.contact_id}
                      nif_tipo={sensitiveData.nif_tipo}
                      nif_numero={sensitiveData.nif_numero}
                      nif_country={sensitiveData.nif_country}
                      handleEditSensitiveData={() => handleEditForm(contact.id)} // Llamamos a la función unificada
                      handleDeleteSensitiveData={() => handleDeleteSensitiveData(sensitiveData.contact_id)}
                    />
                  ))
                }
              </Tab.Pane>
            ))}
          </Tab.Content>
        </Tab.Container>

        {/*Botón de Crear Contacto (colocado correctamente) */}
        <div className="d-flex justify-content-center mt-3">
          <button className="create-contact-btn" onClick={() => navigate("/userform")}>
            <FaPlus className="plus-icon" />
          </button>
        </div>
      </Container>
    </div>
  );
};

export default ContactBody;