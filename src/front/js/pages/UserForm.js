import React, { useState, useEffect, useContext } from "react";
import { Button, Tab, Nav } from "react-bootstrap";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate para redirigir
import { Context } from "../store/appContext"; // Contexto para acceder al store y acciones
import UserContactForm from "../component/UserContactForm.jsx"; // Asegúrate de que la ruta es correcta
import '../../styles/userForm.css'; // Estilos del componente

const UserForm = () => {
  const [key, setKey] = useState("contact");
  const [contactToEdit, setContactToEdit] = useState(null); // Contacto a editar
  const [loading, setLoading] = useState(true); // Estado de carga para el usuario
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (store.user) {
      actions.loadContacts(); // Cargar contactos después de que el usuario esté disponible
      setLoading(false); // Cambiar a false cuando los datos estén listos
    } else {
      setLoading(false); // Si el usuario no está en el store, también desactiva el loading
    }
  }, [store.user]);

  const handleBack = () => {
    navigate("/userhome");
  };

  const handleSaveContact = (contactData) => {
    if (!store.user) {
      console.error("El usuario no está cargado correctamente");
      return;
    }

    if (contactToEdit) {
      actions.updateContact(contactToEdit.id, contactData); // Actualizar contacto
    } else {
      actions.createContact(contactData, () => {
        // Llamar a la función onSuccess después de guardar el contacto
        setContactToEdit(null);  // Limpiar el formulario
        navigate("/userinfo");  // Redirigir a la vista de usuario
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-form">
      <header className="user-navbar fixed-top">
        <Button variant="link" className="back-button" onClick={handleBack}>
          <FaArrowLeft size={20} color="white" />
        </Button>
        <h1 className="user-title">Formulario de Usuario</h1>
      </header>

      <Tab.Container id="left-tabs-example" defaultActiveKey="contact" activeKey={key} onSelect={(k) => setKey(k)}>
        <Nav variant="underline" className="mt-1 d-flex justify-content-center">
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
              contactData={contactToEdit} // Pasamos los datos del contacto si estamos editando
              isEditing={!!contactToEdit} // Verifica si estamos en modo edición
              onSave={handleSaveContact} // Función para guardar
              user={store.user} // Pasamos el usuario para asociar el contacto
            />
          </Tab.Pane>
          <Tab.Pane eventKey="sensitive">
            {/* Aquí se agregará otro componente */}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default UserForm;