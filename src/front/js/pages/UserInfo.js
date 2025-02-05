import React, { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import NavbarHeader from "../component/NavbarHeader.jsx";
import ContactBody from "../component/ContactBody.jsx";
import ContactBanner from "../component/ContactBanner.jsx";
import NavbarFooter from "../component/NavbarFooter.jsx";
import "../../styles/userView/userInfo.css";

const UserInfo = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  // Cargar usuario, contactos y datos sensibles si aún no están cargados
  useEffect(() => {
    if (!store.user || !store.user.id) {
      actions.loadUser().then(() => {
        actions.loadContacts(); // Cargar los contactos
        actions.loadRandomImgs();  // Cargar imágenes aleatorias
      });
    } else {
      actions.loadContacts();
    }
  }, [store.user]);

  useEffect(() => {
    // Cargar los datos sensibles una vez los contactos estén cargados
    if (store.contact && store.contact.length > 0) {
      store.contact.forEach(contact => {
        actions.loadSensitiveData(contact.id); // Cargar datos sensibles para cada contacto
      });
    }
  }, [store.contact]);

  return (
    <div className="app-container">
      <NavbarHeader prevLocation={location.state?.from} />
      <ContactBody
        contactData={store.contact || []}   // Pasamos los contactos al componente
        sensitiveData={store.sensitive_data || []}  // Pasamos los datos sensibles
      />
      <ContactBanner />
      <NavbarFooter />
    </div>
  );
};

export default UserInfo;