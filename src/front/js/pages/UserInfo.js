import React, { useState, useEffect, useContext } from "react";
import { Button, Tab, Nav, Accordion } from "react-bootstrap";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext"; // Contexto para acceder al store y acciones
import '../../styles/userInfo.css'; // Estilos del componente

const UserInfo = () => {
  const [key, setKey] = useState("user01");
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);

  useEffect(() => {
    if (store.user) {
      actions.loadContacts();
      actions.loadSensitiveData();
    }
  }, [store.user]);

  const handleBack = () => {
    navigate("/userhome");
  };

  const handleCreateNewContact = () => {
    // Redirigir a UserForm para crear un nuevo contacto
    navigate("/userform"); 
  };

  const handleEditContact = (contact) => {
    // Redirigir a UserForm con el contacto a editar
    navigate("/userform", { state: { contactToEdit: contact } }); 
  };

  const handleDeleteContact = async (contactId) => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este contacto?");
    if (confirmDelete) {
      await actions.deleteContact(contactId);
      actions.loadContacts();  // Recargar los contactos después de eliminar
      navigate("/userinfo");  // Redirigir a la vista de contactos
    }
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
            <Accordion.Item eventKey="1">
              <Accordion.Header>Datos Sensibles</Accordion.Header>
              <Accordion.Body>
                {sensitiveDataForContact.length > 0 ? (
                  <div>
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
            <Button variant="danger" onClick={() => handleDeleteContact(contact.id)}>
              Eliminar Contacto
            </Button>
          </div>
        </Tab.Pane>
      );
    });
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
          {store.contact.length === 1 ? (
            <Nav.Item>
              <Nav.Link eventKey="user01" className="text-center">Contacto Principal</Nav.Link>
            </Nav.Item>
          ) : (
            store.contact.map((contact, index) => (
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

      <footer className="user-footer fixed-bottom">
        <img src="banner.jpg" alt="Banner Publicitario" className="banner-image" />
      </footer>
    </div>
  );
};

export default UserInfo;