import React, { useState, useEffect, useContext } from "react";
import { Button, Tab, Nav, Accordion, Card } from "react-bootstrap";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext"; // Contexto para acceder al store y acciones
import UserForm from './UserForm'; // Importamos el componente UserForm
import '../../styles/userInfo.css'; // Estilos del componente

const UserInfo = () => {
  const [key, setKey] = useState("user01");
  const [isFormVisible, setIsFormVisible] = useState(false); // Estado para controlar la visibilidad de UserForm
  const [isEditing, setIsEditing] = useState(false);
  const [contactToEdit, setContactToEdit] = useState(null); // Contacto a editar, si aplica
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);  // Usamos el contexto para acceder al store y las acciones

  useEffect(() => {
    if (store.user) {
      console.log("Llamando a loadContacts y loadSensitiveData");  // Verificación
      console.log("Usuario en store:", store.user);
      actions.loadContacts();  // Cargar los contactos
      actions.loadSensitiveData();  // Cargar los datos sensibles
    }
  }, [store.user]); // Esto asegura que solo se ejecute cuando 'store.user' cambie, no en cada render

  console.log("Contactos en el store:", store.contact);
  console.log("Datos Sensibles en el store:", store.sensitive_data);

  const handleBack = () => {
    navigate("/userhome"); // Redirigir al home del usuario
  };

  const handleCreateNewContact = () => {
    setIsEditing(false);  // Cambiar el estado a no editar
    setIsFormVisible(true);  // Mostrar el formulario
  };

  const handleEditContact = (contact) => {
    setContactToEdit(contact);
    setIsEditing(true);
    setIsFormVisible(true);
  };

  const renderTabs = () => {
    if (store.contact.length === 0) {
      return (
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Datos del Contacto</Accordion.Header>
            <Accordion.Body>
              No hay contactos disponibles, por favor cree un contacto...
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      );
    }
  
    // Ordenamos los contactos para que el principal (is_admin = true) sea el primero
    const sortedContacts = store.contact.sort((a, b) => (b.is_admin ? 1 : 0) - (a.is_admin ? 1 : 0));
  
    return sortedContacts.map((contact, index) => {
      // Filtrar los datos sensibles por contacto
      const sensitiveDataForContact = store.sensitive_data
        ? store.sensitive_data.filter((data) => data.contact_id === contact.id)
        : [];
  
      return (
        <Tab.Pane eventKey={`user${index + 1}`} key={contact.id}>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Información del Contacto</Accordion.Header>
              <Accordion.Body>
                Nombre: {contact.nombre} {contact.primer_apellido} {contact.segundo_apellido}<br />
                Teléfono: {contact.telefono_movil} || {contact.telefono_fijo}<br />
                Email: {contact.email}
              </Accordion.Body>
            </Accordion.Item>
  
            {/* Segunda parte del acordeón: Datos Sensibles */}
            <Accordion.Item eventKey="1">
              <Accordion.Header>Datos Sensibles</Accordion.Header>
              <Accordion.Body>
                {sensitiveDataForContact.length > 0 ? (
                  <div>
                    {/* Aquí renderizas los datos sensibles si existen */}
                    {sensitiveDataForContact.map((data) => (
                      <p key={data.id}>
                        Tipo de NIF: {data.nif_tipo}<br />
                        Número de NIF: {data.nif_numero}<br />
                        País: {data.nif_country}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p>No hay datos sensibles disponibles, por favor cree algunos para ver...</p>
                )}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
  
          <div className="buttons-container">
            <Button variant="primary" className="me-2" onClick={() => handleEditContact(contact)}>
              Editar Contacto
            </Button>
            {contact.is_admin && (
              <Button variant="danger">Eliminar Contacto</Button>
            )}
          </div>
        </Tab.Pane>
      );
    });
  };

  return (
    <div id="user-info-container">
      {/* ✅ NavBar Superior */}
      <header className="user-navbar">
        <button className="nav-button" onClick={() => navigate("/userhome")}>
          <FaArrowLeft />
        </button>
        <h1 className="nav-title">User Information</h1>
        <button className="nav-button">
          <FaBars />
        </button>
      </header>

      {/* ✅ Tabs de Contactos */}
      <div className="contact-tabs">
        {contacts.map((contact) => (
          <button
            key={contact.id}
            className={`tab-button ${selectedTab === contact.id ? "active" : ""}`}
            onClick={() => setSelectedTab(contact.id)}
          >
            {contact.id.replace("contact", "Contact ")}
          </button>
        ))}
      </div>

      {/* ✅ Información del Contacto */}
      <div className="contact-card">
        <div className="contact-header">{contacts.find(c => c.id === selectedTab)?.name}</div>
        <div className="contact-details">
          <p><strong>Teléfono 1:</strong> {contacts.find(c => c.id === selectedTab)?.phone1}</p>
          <p><strong>Teléfono 2:</strong> {contacts.find(c => c.id === selectedTab)?.phone2}</p>
          <p><strong>Email:</strong> {contacts.find(c => c.id === selectedTab)?.email}</p>
          <p><strong>Domicilio:</strong> {contacts.find(c => c.id === selectedTab)?.address}</p>
        </div>
      </div>

      {/* ✅ Información Sensible */}
      <div className="sensitive-info">
        <h3>Información Sensible <FaEye /></h3>
      </div>

      {/* ✅ Botones de Acción */}
      <div className="action-buttons">
        <button className="edit-button"><FaEdit /> Editar</button>
        <button className="add-button"><FaPlus /></button>
        <button className="delete-button"><FaTrash /> Eliminar</button>
      </div>

      {isFormVisible && (
        <UserForm
          onSave={actions.saveContact}  // Acción para guardar
          isEditing={isEditing}
          isNew={!isEditing}
          user={contactToEdit}
        />
      )}

      <footer className="user-footer fixed-bottom">
        <img src="banner.jpg" alt="Banner Publicitario" className="banner-image" />
      </footer>
    </div>
  );
};

export default UserInfo;
