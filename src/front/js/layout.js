import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Login } from "./pages/login";
import injectContext from "./store/appContext";

import BackOffice from "./pages/backoffice";
import Contacts from "./component/Contacts.jsx";
import Empresas from "./component/Empresas.jsx";
import ContactTable from "./component/ContactTable.jsx";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";


//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route path="/backoffice" element={<BackOffice />}>
                            {/* Definir las rutas hijas que cargarán en el Outlet */}
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

                        {/* Rutas adicionales */}
                        <Route element={<Home />} path="/" />
                        <Route element={<Login />} path="/login" />
                        <Route path="*" element={<h1>404 Not Found</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
