import React from "react";
import"../../styles/publicView.css"


 const PublicView = () => {
    return (
        <div className="container text-center mt-5 public-view">
            <div className="welcome-section py-5 bg-light rounded shadow">
                <h2 className="text-primary">Bienvenido a Global Turist</h2>
                <p className="lead text-muted mt-3">
                    Explora nuestra plataforma para gestionar tus check-ins de manera fácil.
                </p>
                <a href="/login" className="btn btn-primary btn-lg mt-4">
                    Iniciar Sesión
                </a>
            </div>
        </div>
    );
};
export default PublicView;