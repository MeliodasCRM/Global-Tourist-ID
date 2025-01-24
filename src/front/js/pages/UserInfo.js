import React, { useState, useEffect, useContext } from "react";
import { Button, Tab, Nav, Accordion, Card } from "react-bootstrap";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext"; // Contexto para acceder al store y acciones
import UserForm from './UserForm'; // Importamos el componente UserForm
import '../../styles/userInfo.css'; // Estilos del componente

const UserInfo = () => {
  const [key, setKey] = useState("user01");
  const [contacts, setContacts] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false); // Estado para controlar la visibilidad de UserForm
  const [isEditing, setIsEditing] = useState(false);
  const [contactToEdit, setContactToEdit] = useState(null); // Contacto a editar, si aplica
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);  // Usamos el contexto para acceder al store y las acciones

  // Cargar los contactos cuando el usuario esté autenticado
  useEffect(() => {
    if (store.user) {
      setContacts(store.user.contacts); 
    }
  }, [store.user]);

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

  const handleSaveContact = async (formData, isEditing, isNew) => {
    try {
      // Usamos una sola acción para crear o editar el contacto
      await actions.createNewContact(formData);
      setIsFormVisible(false);  // Ocultamos el formulario después de guardar
    } catch (error) {
      console.error("Error al guardar contacto:", error);
    }
  };

  const renderTabs = () => {
    if (contacts.length === 0) {
      return (
        <Tab.Pane eventKey="user01">
          <p>No hay contactos disponibles.</p>
        </Tab.Pane>
      );
    }

    return contacts.map((contact, index) => (
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
    ));
  };

  return (
    <div className="user-info">
      <header className="user-navbar fixed-top">
        <Button variant="link" className="back-button" onClick={handleBack}>
          <FaArrowLeft size={20} color="white" />
        </Button>
        <h1 className="user-title">Información de Usuario</h1>
        <Button variant="success" className="profile-button" onClick={handleCreateNewContact}>
          <FaPlus size={20} color="white" />
        </Button>
      </header>

      <Tab.Container id="left-tabs-example" defaultActiveKey="user01" activeKey={key} onSelect={(k) => setKey(k)}>
        <Nav variant="underline" className="mt-1 d-flex justify-content-center">
          {contacts.length === 1 ? (
            <Nav.Item>
              <Nav.Link eventKey="user01" className="text-center">Contacto Principal</Nav.Link>
            </Nav.Item>
          ) : (
            contacts.map((contact, index) => (
              <Nav.Item key={contact.id}>
                <Nav.Link eventKey={`user${index + 1}`} className="text-center">
                  {`Contacto ${index + 1}`}
                </Nav.Link>
              </Nav.Item>
            ))
          )}
        </Nav>
        <Tab.Content>
          {renderTabs()}
        </Tab.Content>
      </Tab.Container>

      {isFormVisible && (
        <UserForm
          onSave={handleSaveContact}
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