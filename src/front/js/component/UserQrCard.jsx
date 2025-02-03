import React from "react";
import { FaPhoneAlt, FaEye } from "react-icons/fa";
import { AiTwotoneMail } from "react-icons/ai";
import "../../styles/userView/userContactCard.css";

const UserQrCard = ({ 
    id, imageUrl, nombre, primer_apellido, segundo_apellido, telefono_movil, email,
    handleEditContact, handleDeleteContact, verContacto}) => {
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

                    {/* Fila de botones de acción dentro de la columna de texto */}
                    <div className="contact-actions">
                        <div className="contact-action-btn" onClick={() => verContacto(id)}>
                            <FaEye />
                        </div>
                        {/* <div className="contact-action-btn" onClick={() => handleEditContact(id)}>
                            <FaEdit />
                        </div>
                        <div className="contact-action-btn" onClick={() => handleDeleteContact(id)}>
                            <FaTrash />
                        </div> */}
                    </div>
                </div>
            </div>
        </li>
    );
};

export default UserQrCard;