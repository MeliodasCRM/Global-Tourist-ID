import React, { useEffect, useContext} from "react";
import { Context } from "../store/appContext";
import "../../styles/userView.css"

const UserView = () => {
   {/* const {store, actions} = useContext(Context);
    useEffect(() => {
        // puedo cargar datos especificos de un usuario
        actions.loadUserData();
    }, []);*/}

     return(
    <div className="container mt-5 user-view">
            <div className="welcome-section text-center py-4 bg-light rounded shadow">
                <h2 className="text-primary">Bienvenido, {/*{store.user?.name || "Usuario"}*/}</h2>
                <p className="lead text-muted">
                    Aquí puedes realizar tu check-in y generar tu código QR.
                </p>
            </div>

            <div className="content-section mt-5 p-4 bg-white rounded shadow">
                <h3 className="text-secondary">Opciones Disponibles</h3>
                <p>
                    Utiliza las herramientas a continuación para completar tu proceso de check-in de manera rápida y sencilla.
                </p>

                {/* Aquí puedes agregar más componentes */}
                <div className="actions mt-4">
                    <button className="btn btn-primary me-3">Realizar Check-In</button>
                    <button className="btn btn-success">Generar Código QR</button>
                </div>
            </div>
        </div>
    );
       
};
export default UserView;