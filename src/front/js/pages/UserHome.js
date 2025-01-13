import React from "react";
import { useNavigate } from "react-router-dom";


export const UserHome = () => {
     const Navigate = useNavigate();


     return (
        <div className="container my-5">
           <h1>Bienvenido a tu Area Privda</h1>
           <p>Seleciona una opcion para continuar:</p>
           <div className="d-flex flex-column gap-3">
             <button className="btn btn-primary" onClick={() => Navigate("/user/usuarios")}>
               usuarios
             </button>
             <button className="btn btn-secondary" onClick={() => Navigate("/user/grupos")}>
               Grupos
             </button>
             <button className="btn btn-success" onClick={() => Navigate("/user/reservas")}>
               Reservas
             </button>
             <button className="btn btn-warning" onClick={() => Navigate("/user/qr")}>
               Generar QR
             </button>
           </div>
        </div>
     );
}

