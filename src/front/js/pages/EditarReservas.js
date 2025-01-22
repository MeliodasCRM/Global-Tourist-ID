import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";


export const EditarReservaForm = () => {
    const { id } = useParams();

    const [reservaData, setReservaData] = useState({
        alojamiento: "Alojamiento Actual",
        fechaEntrada: "2025-01-01",
        fechaSalida: "2025-01-15",
        metodoPago: "visa",
    });

    const [qrData, setQrData] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setReservaData({
            ...reservaData,
            [e.target.name]: e.target.value,
        });
    };

    const handleGenerateQR = () => {
        setQrData(JSON.stringify(reservaData));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Reserva actualizada.");
        navigate("/reservas");
    };

    return (
        <div className="container my-4">
            <h2>Editar Reserva {id}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Alojamiento</label>
                    <input
                        type="text"
                        name="alojamiento"
                        className="form-control"
                        value={reservaData.alojamiento}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Fecha de Entrada</label>
                    <input
                        type="date"
                        name="fechaEntrada"
                        className="form-control"
                        value={reservaData.fechaEntrada}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Fecha de Salida</label>
                    <input
                        type="date"
                        name="fechaSalida"
                        className="form-control"
                        value={reservaData.fechaSalida}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Método de Pago</label>
                    <select
                        name="metodoPago"
                        className="form-control"
                        value={reservaData.metodoPago}
                        onChange={handleChange}
                        required
                    >
                        <option value="visa">VISA</option>
                        <option value="mastercard">MasterCard</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">
                    Guardar Cambios
                </button>
                <button
                    type="button"
                    className="btn btn-secondary mx-2"
                    onClick={handleGenerateQR}
                >
                    Generar QR
                </button>
            </form>

            {qrData && (
                <div className="mt-4">
                    <h4>Código QR Generado</h4>
                    <QRCodeCanvas value={qrData} size={256} />
                </div>
            )}
        </div>
    );
};
