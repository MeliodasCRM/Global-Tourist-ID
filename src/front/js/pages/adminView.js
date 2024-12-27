import React,{ useEffect, useContext} from "react";
import { Context } from "../store/appContext";

const AdminView = () => {
    const { store, actions} = useContext(Context);

    useEffect(() => {
  // datos especificos del administrador
  actions.loadAdminData();
    }, [])

    return (
        <div className="container">
            <h2>Panel del Administrador</h2>
            <p>Gestiona los check-ins y reporta datos a las autoridades.</p>
            {/* Agrega funcionalidades específicas aquí */}
        </div>
    );

};
export default AdminView;