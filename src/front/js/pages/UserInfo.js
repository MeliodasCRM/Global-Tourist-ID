import React, { useState, useEffect, useContext } from "react";
import { FaArrowLeft, FaBars, FaEye, FaEdit, FaPlus, FaTrash, FaHome, FaUser, FaQrcode, FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/userInfo.css"; 

const UserInfo = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("contact01");

  useEffect(() => {
    actions.loadContacts();
    actions.loadSensitiveData();
  }, []);

  const contacts = store.contacts || [
    { id: "contact01", name: "Jorge Mauricio Sonzogni Novo", phone1: "+34 691 120 553", phone2: "+34 789 987 987", email: "msonzogni@gmail.com", address: "C. Alguna, 3 - 28028, Málaga, España" },
    { id: "contact02", name: "Contacto 2", phone1: "+34 600 000 000", phone2: "+34 611 111 111", email: "contacto2@gmail.com", address: "C. Ejemplo, 4 - Madrid, España" },
    { id: "contact03", name: "Contacto 3", phone1: "+34 612 345 678", phone2: "+34 623 456 789", email: "contacto3@gmail.com", address: "C. Barcelona, 5 - Barcelona, España" },
  ];

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

      {/* ✅ NavBar Inferior */}
      <nav className="bottom-nav">
        <button className="nav-item" onClick={() => navigate("/userhome")}>
          <FaHome />
        </button>
        <button className="nav-item active">
          <FaUser />
        </button>
        <button className="nav-item">
          <FaQrcode />
        </button>
        <button className="nav-item">
          <FaHistory />
        </button>
      </nav>
    </div>
  );
};

export default UserInfo;
