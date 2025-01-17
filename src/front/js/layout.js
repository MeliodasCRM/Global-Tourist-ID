import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
// import i18n from '../../i18n';

import { Home } from "./pages/home";
import { Login } from "./pages/login";
import injectContext from "./store/appContext";


import BackOffice from "./pages/backoffice";
import Contacts from "./component/Contacts.jsx";
import ContactTable from "./component/ContactTable.jsx";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import PublicView from "./pages/publicView";
import UserView from "./pages/userView";
import UserHome from "./pages/UserHome.js";
import UserInfo from "./pages/UserInfo.js";
import PrivateRoute from "./component/PrivateRoute.jsx";


//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter>
                <ScrollToTop>
                <Navbar /> {/* Navbar global */}
                    <Routes>
                        {/* Rutas para el BackOffice */}
                        <Route path="/backoffice" element={<BackOffice />}>
                            {/* Rutas hijas que cargarán en el Outlet */}
                            <Route path="contacts" element={<Contacts />} />
                            <Route path="contactTable" element={<ContactTable />} />
                            <Route path="tourpass" element={<h2>Traveler Information Page</h2>} />
                            <Route path="groups" element={<h2>Groups Page</h2>} />
                            <Route path="roles" element={<h2>Roles de Usuario Page</h2>} />
                            <Route path="empresas" element={<h2>Alojamientos Page</h2>} />
                            <Route path="reservas" element={<h2>Reservas Page</h2>} />
                            <Route path="checkinonline" element={<h2>Check In Online Page</h2>} />
                            <Route path="settings" element={<h2>Settings Page</h2>} />
                            <Route path="tokens" element={<h2>Tokens Manager Page</h2>} />
                            <Route path="api" element={<h2>API Manager Page</h2>} />
                            <Route path="permits" element={<h2>Permisos de Usuario Page</h2>} />
                        </Route>

                        {/* Rutas generales */}
                        <Route path="/" element={<Home />} />
                        <Route path="/publica" element={<PublicView />} />
                        <Route path="/user" element={<UserView />} />
                        <Route path="/login" element={<Login />} />

                        {/* Ruta protegida para UserHome */}
                        <Route path="/userhome" element={<PrivateRoute element={UserHome} />} />
                        <Route path="/userinfo" element={<PrivateRoute element={UserInfo} />} />

                        {/* Ruta para manejar 404 */}
                        <Route path="*" element={<h1>404 Not Found</h1>} />
                    </Routes>

                    {/* Navbar y Footer solo se muestran en las rutas generales */}

                    <Footer /> {/* Footer global */}
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
