import React from "react";
import "../../styles/userHome.css"; // Usamos los estilos desde el archivo CSS

const UserQrCard = ({ id, nombre, fecha_inicio, fecha_fin, verContacto }) => {
  return (
    <div className="qr-info-card-content" onClick={() => verContacto(id)}>
      <h3>{nombre}</h3>
      <p>{`Del ${fecha_inicio} al ${fecha_fin}`}</p>
    </div>
  );
};

export default UserQrCard;