import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { BsHouse, BsBuilding, BsPeople, BsPerson, BsGear, BsYinYang, BsDiagram2, BsList, BsCardChecklist,
        BsCalendar2Date, BsKey, BsPersonGear,BsPersonExclamation, BsBuildingCheck } from "react-icons/bs";
import "../../styles/backoffice.css";

const BackOffice = () => {
  const [openSubmenus, setOpenSubmenus] = useState({
    users: false,
    empresas: false,
    settings: false
  });

  const toggleSubmenu = (submenu) => {
    setOpenSubmenus(prevState => ({
      ...prevState,
      [submenu]: !prevState[submenu]
    }));
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        {/* Sidebar siempre visible */}
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
              <BsList className="fs-5" />
              <span className="fs-5 d-none d-sm-inline">Menu</span>
            </a>
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
              <li className="nav-item">
                <Link to="/" className="nav-link align-middle px-0">
                  <BsHouse className="fs-5" /> <span className="ms-1 d-none d-sm-inline">Home</span>
                </Link>
              </li>
              {/* Submenú de Contacts */}
              <li>
                <Link to="/backoffice/contacts"
                  className="nav-link px-0 align-middle"
                  onClick={() => toggleSubmenu('users')}>
                  <BsPerson className="fs-5" /> <span className="ms-1 d-none d-sm-inline">Contacts</span>
                </Link>
                <ul className={`collapse ${openSubmenus.users ? "show" : ""} submenu-users`}>
                  <li>
                    <Link to="/backoffice/tourpass" className="nav-link px-0">
                      <BsPersonExclamation className="fs-5" /> <span className="d-none d-sm-inline">TourPass</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/backoffice/roles" className="nav-link px-0">
                      <BsPersonGear className="fs-5" /> <span className="d-none d-sm-inline">Roles</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/backoffice/groups" className="nav-link px-0">
                      <BsPeople className="fs-5" /> <span className="d-none d-sm-inline">Groups</span>
                    </Link>
                  </li>
                </ul>
              </li>
              {/* Submenú de Alojamientos */}
              <li>
                <Link to="/backoffice/empresas"
                  className="nav-link px-0 align-middle"
                  onClick={() => toggleSubmenu('empresas')}>
                  <BsBuilding className="fs-5" /> <span className="ms-1 d-none d-sm-inline">Alojamientos</span>
                </Link>
                <ul className={`collapse ${openSubmenus.empresas ? "show" : ""} submenu-empresas`}>
                  <li>
                    <Link to="/backoffice/reservas" className="nav-link px-0">
                      <BsCalendar2Date className="fs-5" /> <span className="d-none d-sm-inline">Reservas</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/backoffice/checkinonline" className="nav-link px-0">
                      <BsBuildingCheck className="fs-5" /> <span className="d-none d-sm-inline">CheckIn Online</span>
                    </Link>
                  </li>
                </ul>
              </li>
              {/* Submenú de Settings */}
              <li>
                <Link to="/backoffice/settings"
                  className="nav-link px-0 align-middle"
                  onClick={() => toggleSubmenu('settings')}>
                  <BsGear className="fs-5" /> <span className="ms-1 d-none d-sm-inline">Settings</span>
                </Link>
                <ul className={`collapse ${openSubmenus.settings ? "show" : ""} submenu-settings`}>
                  <li>
                    <Link to="/backoffice/tokens" className="nav-link px-0">
                      <BsKey className="fs-5" /> <span className="d-none d-sm-inline">Tokens</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/backoffice/api" className="nav-link px-0">
                      <BsDiagram2 className="fs-5" /> <span className="d-none d-sm-inline">API's</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/backoffice/permits" className="nav-link px-0">
                      <BsCardChecklist className="fs-5" /> <span className="d-none d-sm-inline">Permits</span>
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        {/* Contenido principal donde se carga el componente correspondiente */}
        <div className="col py-3">
          <h3>BackOffice Actions</h3>
          <hr />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default BackOffice;