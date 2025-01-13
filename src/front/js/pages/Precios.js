import React from "react";

export const Precios = () => {
    return (
        <div className="bg-white p-4 rounded shadow">
            <h2 className="text-center">Nuestros Precios</h2>
            <ul className="list-group">
                <li className="list-group-item">Plan Básico: $10/mes</li>
                <li className="list-group-item">Plan Avanzado: $20/mes</li>
                <li className="list-group-item">Plan Premium: $30/mes</li>
            </ul>
        </div>
    );
};
