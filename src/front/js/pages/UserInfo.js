import React, { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Context } from "../store/appContext";
import { FaPlus } from "react-icons/fa"; // Importamos el icono "+"
import NavbarHeader from "../component/NavbarHeader.jsx";
import ContactBody from "../component/ContactBody.jsx";
import ContactBanner from "../component/ContactBanner.jsx";
import NavbarFooter from "../component/NavbarFooter.jsx";
import "../../styles/userView/userInfo.css";

const UserInfo = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!store.user || !store.user.id) {
      actions.loadUser().then(() => {
        actions.loadContacts();
        actions.loadSensitiveData();
      });
    } else {
      actions.loadContacts();
      actions.loadSensitiveData();
    }
  }, [store.user]);

  return (
    <div className="app-container">
      <NavbarHeader prevLocation={location.state?.from} />
      <ContactBody contacts={store.contact || []} />
      <ContactBanner />
      <NavbarFooter />
    </div>
  );
};

export default UserInfo;