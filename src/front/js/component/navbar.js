import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext"; // Importar el contexto de Flux
import { Link } from "react-router-dom";
import "../../styles/navbar.css";

export const Navbar = () => {
  const { store } = useContext(Context);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setAuthToken(token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary custom-navbar">
      <div className="container-fluid">
        <Link to="/">
          <span className="navbar-brand" href="#"> Global Turist </span>

        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo02"
          aria-controls="navbarTogglerDemo02"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/User">
                <span className="nav-link active" aria-current="page"> User </span>
              </Link>
            </li>
         
            <li className="nav-item">

            <Link to="/Publica">
                <span className="nav-link active" aria-current="page"> Publica </span>
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" aria-disabled="true">
                BackOffice
              </a>
            </li>
          </ul>
          <div>
            {store.authToken ? (
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <Link to="/login">
                <button className="btn btn-success">Login</button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};