import React, { useContext } from "react";
import { FaPhoneAlt, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { AiTwotoneMail } from "react-icons/ai";
import { Context } from "../store/appContext";
import "../../styles/userView/userContactCard.css";

const UserContactCard = ({
  id,
  nombre,
  primer_apellido,
  segundo_apellido,
  telefono_movil,
  email,
  handleEditContact,
  handleDeleteContact,
  verContacto
}) => {
  const { store } = useContext(Context); // Acceso al store desde el Context

  // Función para obtener una imagen aleatoria
  const getRandomImage = () => {
    const UserImages = store.UserImages;
    if (UserImages && UserImages.length > 0) {
      const randomImage = UserImages[Math.floor(Math.random() * UserImages.length)];
      return randomImage?.picture?.large || "https://via.placeholder.com/50";
    }
    return "https://via.placeholder.com/50";  // Imagen por defecto si no hay imágenes
  };

  // Asignamos la imagen aleatoria a imageUrl
  const imageUrl = getRandomImage();

  return (
    <li className="contact-card list-group-item">
      {/* Contenedor de las dos columnas */}
      <div className="contact-content">
        {/* Columna 1: Imagen */}
        <div className="contact-image-container">
          <img src={imageUrl} alt={nombre} className="contact-image" />
        </div>

        {/* Columna 2: Información del contacto con botones */}
        <div className="contact-info">
          <span className="contact-name">{nombre} {primer_apellido} {segundo_apellido}</span>
          <span className="contact-text"><FaPhoneAlt /> {telefono_movil}</span>
          <span className="contact-text"><AiTwotoneMail /> {email}</span>
        </div>
      </div>
    </li>
  );
};

export default UserContactCard;