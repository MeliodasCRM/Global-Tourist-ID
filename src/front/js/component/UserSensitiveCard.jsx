import React from "react";
import { FaMapMarkerAlt, FaEdit, FaTrash } from "react-icons/fa";
import "../../styles/userView/userSensitiveCard.css";

const UserSensitiveCard = ({ 
    id, nif_tipo, nif_numero, nif_country, handleEditSensitiveData, handleDeleteSensitiveData 
}) => {
    return (
        <li className="contact-card list-group-item">
            {/* Contenedor de las dos columnas */}
            <div className="contact-content">
                {/* Columna 1: Información sensible */}
                <div className="contact-info">
                    <span className="contact-name">NIF: {nif_tipo} - {nif_numero}</span>
                    <span className="contact-text"><FaMapMarkerAlt /> País de Expedición: {nif_country}</span>

                    {/* Fila de botones de acción dentro de la columna de texto */}


                </div>
            </div>
        </li>
    );
};

export default UserSensitiveCard;