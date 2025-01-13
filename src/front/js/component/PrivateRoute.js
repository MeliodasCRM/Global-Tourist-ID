import React, {useContext} from "react";
import { Navigate } from "react-router-dom";
import {Context} from "../store/appContext";


export const PrivateRoute = ({ children }) => {
    const { store } = useContext(Context);
    if (!store.authToken) {
        return <Navigate to="/login" />
    }
    return children;
};