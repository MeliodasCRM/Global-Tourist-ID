import React, { useState, useEffect } from "react";
import { Container, Tab, Nav } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import UserContactCard from "./UserContactCard.jsx"; // Importa el componente de la card
import '../../styles/userView/userInfo.css';

const ContactBody = ({ contacts, handleEditContact, handleDeleteContact }) => {
  const [activeTab, setActiveTab] = useState("0");

  useEffect(() => {
    if (contacts && contacts.length > 0) {
      setActiveTab("0"); // Establecer la pestaña activa en la primera
    }
  }, [contacts]);

  // 🚀 Si no hay contactos, mostrar mensaje
  if (!contacts || contacts.length === 0) {
    return (
      <Container className="body-content">
        <div className="no-data-card">
          <h4>No hay contactos disponibles</h4>
          <p>Por favor, cree un contacto...</p>
        </div>
      </Container>
    );
  }

  // 🚀 Si solo hay un contacto
  if (contacts.length === 1) {
    const contact = contacts[0];

    return (
      <div className="contact-body">
        <Container className="body-content">
          <Tab.Container activeKey="0">
            <Nav variant="pills" className="contact-tabs">
              <Nav.Item>
                <Nav.Link eventKey="0" className="contact-tab">
                  <FaUserCircle size={24} /> <span className="tab-text">{contact.nombre}</span>
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="0">
                <UserContactCard
                  id={contact.id}
                  imageUrl={contact.imageUrl || "https://via.placeholder.com/50"}
                  nombre={contact.nombre}
                  primer_apellido={contact.primer_apellido}
                  segundo_apellido={contact.segundo_apellido}
                  sexo={contact.sexo}
                  nacionalidad={contact.nacionalidad}
                  fecha_nacimiento={contact.fecha_nacimiento}
                  direccion={contact.direccion}
                  localidad={contact.localidad}
                  pais={contact.pais}
                  email={contact.email}
                  telefono_movil={contact.telefono_movil}
                  telefono_fijo={contact.telefono_fijo}
                  is_admin={contact.is_admin}
                  user_id={contact.user_id}
                  editarContacto={() => handleEditContact(contact)}
                  borrarContacto={() => handleDeleteContact(contact.id)}
                />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Container>
      </div>
    );
  }

  // 🚀 Si hay más de un contacto, ordenar colocando el admin primero
  const adminContact = contacts.find(contact => contact.is_admin);
  const otherContacts = contacts.filter(contact => !contact.is_admin);
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
                <UserContactCard
                  id={contact.id}
                  imageUrl={contact.imageUrl || "https://via.placeholder.com/50"}
                  nombre={contact.nombre}
                  primer_apellido={contact.primer_apellido}
                  segundo_apellido={contact.segundo_apellido}
                  sexo={contact.sexo}
                  nacionalidad={contact.nacionalidad}
                  fecha_nacimiento={contact.fecha_nacimiento}
                  direccion={contact.direccion}
                  localidad={contact.localidad}
                  pais={contact.pais}
                  email={contact.email}
                  telefono_movil={contact.telefono_movil}
                  telefono_fijo={contact.telefono_fijo}
                  is_admin={contact.is_admin}
                  user_id={contact.user_id}
                  handleEditContact={() => handleEditContact(contact.id)}
                  handleDeleteContact={() => handleDeleteContact(contact.id)}
                />
              </Tab.Pane>
            ))}
          </Tab.Content>
        </Tab.Container>
      </Container>
    </div>
  );
};

export default ContactBody;