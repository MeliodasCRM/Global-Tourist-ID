import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const DetallesReserva = () => {
    const { id } = useParams();
    const navigate = useNavigate();


    const detalles = [
        { id: 1, destino: "Barcelona", fecha: "23/01/2025 al 15/02/2025", estado: "Confirmado" },
        { id: 2, destino: "Roma", fecha: "01/02/2025 al 20/02/2025", estado: "Pendiente" },
        { id: 3, destino: "Madrid", fecha: "10/03/2025 al 25/03/2025", estado: "Cancelado" },
    ];

    // Estado local para controlar la reserva seleccionada
    const [selectedReserva, setSelectedReserva] = useState(
        detalles.find((reserva) => reserva.id === parseInt(id)) || detalles[0]
    );

    // Manejar el cambio de reserva
    const handleSelectReserva = (e) => {
        const nuevaReserva = detalles.find((reserva) => reserva.id === parseInt(e.target.value));
        setSelectedReserva(nuevaReserva);
    };

    return (
        <div className="container my-4">
            {/* volver atras */}
            <button className="btn btn-primary" onClick={() => navigate("/reservas")}>Volver</button>
            <h2>Detalle de la Reserva</h2>
            <div className="mb-3">
                <label htmlFor="selectReserva" className="form-label">Seleccionar otra reserva</label>
                <select
                    id="selectReserva"
                    className="form-select"
                    value={selectedReserva.id}
                    onChange={handleSelectReserva}
                >
                    {detalles.map((reserva) => (
                        <option key={reserva.id} value={reserva.id}>
                            {reserva.destino}
                        </option>
                    ))}
                </select>
            </div>

            <div className="card shadow mt-4">
                <div className="card-body">
                    <h5 className="card-title">{selectedReserva.destino}</h5>
                    <p className="card-text">Fecha: {selectedReserva.fecha}</p>
                    <p className="card-text">Estado: {selectedReserva.estado}</p>
                    <div className="d-flex justify-content-between">
                    </div>
                </div>
            </div>
            <button className="btn btn-secondary mt-3" onClick={() => navigate("/userinfo")}>Información del Usuario</button>
            <button className="btn btn-danger">Cancelar Reserva</button>
            <button
                className="btn btn-primary"
                onClick={() => navigate(`/editar-reserva/${selectedReserva.id}`)}>
                Editar Reserva
            </button>
        </div>
    );
};
