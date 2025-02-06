import React from "react";
import { FaEye } from "react-icons/fa";
import "../../styles/userView/userContactCard.css";

const UserQrCard = ({ 
    id, nombre, fecha_inicio, fecha_fin, data, handleEditContact, handleDeleteContact, verContacto 
}) => {
    return (
        <li className="contact-card list-group-item">
            {/* Contenedor de las dos columnas */}
            <div className="contact-content">
                {/* Columna 1: Datos del QR */}
                <div className="contact-info">
                    <span className="contact-name">{nombre}</span>
                    <span className="contact-text">Inicio: {new Date(fecha_inicio).toLocaleDateString()}</span>
                    <span className="contact-text">Fin: {new Date(fecha_fin).toLocaleDateString()}</span>
                    <span className="contact-text">Data: {data}</span>

                    {/* Fila de botones de acción dentro de la columna de texto */}
                    <div className="contact-actions">
                        <div className="contact-action-btn" onClick={() => verContacto(id)}>
                            <FaEye />
                        </div>
                        {/* Si quieres habilitar botones de editar y eliminar, puedes agregar lo siguiente */}
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