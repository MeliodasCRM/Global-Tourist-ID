import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import "../../styles/QRHistory.css";

const QRCard = ({ qr, onDelete }) => {
    const navigate = useNavigate();

    const handleShowQR = () => {
        navigate('/userHome', { state: { qrData: qr } });
    };

    return (
        <div className="qr-history-card">
            <div className="qr-info-container">
                <img src={qr.data} alt="QR Code" className="qr-thumbnail" />
                <div className="qr-details">
                    <h3>{qr.nombre}</h3>
                    <p>Del {qr.fecha_inicio} al {qr.fecha_fin}</p>
                    <button onClick={handleShowQR} className="show-qr-link">
                        <FaEye className="eye-icon" />
                        Show QR...
                    </button>
                </div>
            </div>
            <button onClick={() => onDelete(qr.id)} className="delete-button">
                ×
            </button>
        </div>
    );
};

const QRHistory = () => {
    const [qrCodes, setQrCodes] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchQRCodes();
    }, []);

    const fetchQRCodes = async () => {
        try {
            const userId = 1; // Por ahora hardcodeado como hicimos antes
            const token = localStorage.getItem("authToken");
            const BACKEND_URL = process.env.BACKEND_URL;

            const response = await fetch(`${BACKEND_URL}api/user/${userId}/qrcodes`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar el historial');
            }

            const data = await response.json();
            if (data.success) {
                setQrCodes(data.qr_codes);
            }
        } catch (error) {
            setError("No se pudo cargar el historial");
            console.log("Error al cargar QRs");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (qrId) => {
        try {
            const userId = 1; // Por ahora hardcodeado como hicimos antes
            const token = localStorage.getItem("authToken");
            const BACKEND_URL = process.env.BACKEND_URL;

            const response = await fetch(`${BACKEND_URL}api/user/${userId}/qrcode/${qrId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el QR');
            }

            const data = await response.json();
            if (data.success) {
                setQrCodes(qrCodes.filter(qr => qr.id !== qrId));
                console.log("QR eliminado correctamente");
            }
        } catch (error) {
            setError("No se pudo eliminar el QR");
            console.log("Error al eliminar QR");
        }
    };

    if (isLoading) return <div className="loading">Cargando...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="qr-history-container">
            {qrCodes.length === 0 ? (
                <p className="no-qr-message">No hay códigos QR en el historial</p>
            ) : (
                qrCodes.map(qr => (
                    <QRCard
                        key={qr.id}
                        qr={qr}
                        onDelete={handleDelete}
                    />
                ))
            )}
        </div>
    );
};

export default QRHistory;