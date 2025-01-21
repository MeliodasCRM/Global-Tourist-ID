import React, { useEffect, useContext} from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/ReservaUser.css"

 export const UserReservas = () => {
    const {store, actions} = useContext(Context);
    const navigate = useNavigate();

    const reservas = [
        {id: 1, destino: "Madrid", fecha: "23/09/2024 al 30/09/2024",estado: "confirmada"},
        {id: 2, destino: "Roma", fecha: "10/10/2024 al 30/10/2024",estado: "pendiente"},
    ]

     return(
    <div className="container my-4">
       {/* Navbar */}
       <button className="btn btn-primary" onClick={() => navigate("/userInfo")}>Volver</button>
       <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Proximas Reservas</h2>
            <button className="btn btn-success" onClick={() => navigate("/nueva-reserva")}>
                 +
            </button>
       </div>
       {/*Listado de Reservas */}
        <div className="list-group">
            {reservas.map((reserva) => (
                <div key={reserva.id} className="list-group-item  d-flex justify-content-between align-items-center">
                    <div onClick={() => navigate(`/reserva/${reserva.id}`)}>
                        <h5>{reserva.destino}</h5>
                        <p>{reserva.fecha}</p>
                    </div>
                    <button className="btn btn-prymary" onClick={() => navigate(`/editar-reserva/${reserva.id}`)} 
                       
                       >
                         ✏️
                    </button>
                </div>
            ))}
        </div>
    </div>
    );
       
};
