import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Context } from '../store/appContext'; // Asegúrate de que el contexto esté correcto
import { jwtDecode } from 'jwt-decode'; // Usando el named import

const PrivateRoute = ({ element: Element, ...rest }) => {
  const { store } = useContext(Context);
  const { authToken } = store;

  const isTokenValid = () => {
    if (!authToken) return false;
    try {
      const decoded = jwtDecode(authToken);
      const currentTime = Date.now() / 1000; // Verifica si el token ha expirado
      return decoded.exp > currentTime;
    } catch (error) {
      return false; // Si el token no es válido
    }
  };

  return isTokenValid() ? (
    <Element {...rest} /> // Asegúrate de que este sea un componente válido
  ) : (
    <Navigate to="/login" /> // Redirige a login si el token no es válido
  );
};

export default PrivateRoute;