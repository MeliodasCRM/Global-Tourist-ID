import React from "react";


export const QRGenerator = () => {
     const handleGenerateQR = () => {
        alert("Codigo QR Generado");
     };

     return(
        <div className="container my-5">
            <h2>Generar QR</h2>
            <button className="btn btn-primary" onClick={ handleGenerateQR }>
             Generar codigo QR
            </button>
        </div>
     );
}