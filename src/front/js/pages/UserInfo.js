import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import NavbarHeader from "../component/NavbarHeader.jsx";
import ContactBody from "../component/ContactBody.jsx";
import ContactBanner from "../component/ContactBanner.jsx";
import NavbarFooter from "../component/NavbarFooter.jsx";
import '../../styles/userView/userInfo.css';

const UserInfo = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("UserInfo: Cargando datos del usuario...");
    
    if (!store.user || !store.user.id) {
        console.log("Usuario no disponible, cargando...");
        actions.loadUser().then(() => {
            console.log("Usuario cargado, ahora cargando contactos...");
            actions.loadContacts().then(() => {
                console.log("Contactos cargados:", store.contact);
            });
            actions.loadSensitiveData();
        });
    } else {
        console.log("Usuario ya disponible, cargando contactos...");
        actions.loadContacts().then(() => {
            console.log("Contactos cargados:", store.contact);
        });
        actions.loadSensitiveData();
    }
}, [store.user]);

  console.log("UserInfo: store.contact =>", store.contact);

  const handleBack = () => {
    navigate(location.state?.from || "/userhome");
  };

  const handleCreateNewContact = () => {
    navigate("/userform");
  };

  const handleEditContact = (contactId) => {
    const contacts = store.contact || []; // Evita que sea undefined

    console.log("handleEditContact: store.contact =>", contacts);

    if (contacts.length === 0) {
        console.error("handleEditContact: No hay contactos en el store");
        return;
    }

    const selectedContact = contacts.find(contact => contact.id === contactId);

    if (selectedContact) {
        console.log("handleEditContact: Contacto encontrado =>", selectedContact);
        navigate("/userform", { state: { contactToEdit: selectedContact } });
    } else {
        console.error("handleEditContact: No se encontró el contacto con id:", contactId);
    }
};

  const handleDeleteContact = async (contactId) => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este contacto?");
    if (confirmDelete) {
      await actions.deleteContact(contactId);
      actions.loadContacts();
      navigate("/userinfo");
    }
  };

  return (
    <div className="app-container">
      <NavbarHeader prevLocation={location.state?.from} />
      <ContactBody
        contacts={store.contact}
        handleEditContact={handleEditContact}
        handleDeleteContact={handleDeleteContact}
      />
      <ContactBanner />
      <NavbarFooter />
    </div>
  );
};

export default UserInfo;