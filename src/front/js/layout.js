import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import injectContext from "./store/appContext";
import BackOffice from "./pages/backoffice";
import ContactTable from "./component/ContactTable.jsx";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import PrivateRoute from "./component/PrivateRoute.jsx";
import PublicView from "./pages/publicView";
import { UserReservas } from "./pages/UserReservas.js";
import { NuevaReservaForm } from "./pages/NuevaReserva.js";
import { EditarReservaForm } from "./pages/EditarReservas.js";
import { DetallesReserva } from "./pages/DetallesReserva.js";
import UserHome from "./pages/UserHome.js";
import UserInfo from "./pages/UserInfo.js";
import UserForm from "./pages/UserForm.js";
import QrShare from "./pages/QrShare.js";
import QrGenerator from "./pages/QrGenerator.js";
import QrHistory from "./pages/QrHistory.js";

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

                        <Route path="/login" element={<Login />} />
                        {/* Ruta protegida para UserHome */}
                        <Route path="/userhome" element={<PrivateRoute element={UserHome} />} />
                        <Route path="/userinfo" element={<PrivateRoute element={UserInfo} />} />
                        <Route path="/userform" element={<PrivateRoute element={UserForm} />} />
                        <Route path="/qrhistory" element={<PrivateRoute element={QrHistory} />} />
                        <Route path="/reservas" element={<PrivateRoute element={UserReservas} />} />
                        <Route path="/nueva-reserva" element={<PrivateRoute element={NuevaReservaForm} />} />
                        <Route path="/editar-reserva/:id" element={<PrivateRoute element={EditarReservaForm} />} />
                        <Route path="/reserva/:id" element={<PrivateRoute element={DetallesReserva} />} />
                        <Route path="/share" element={<PrivateRoute element={QrShare} />} />
                        <Route path="/generate" element={<PrivateRoute element={QrGenerator} />} />

                        {/* Ruta para manejar 404 */}
                        <Route path="*" element={<h1>404 Not Found</h1>} />

                        {/* Rutas adicionales */}


                        {/* <Route path="/reservas" element={<UserReservas />} /> */}
                        {/* <Route path="/nueva-reserva" element={<NuevaReservaForm />} />
                        <Route path="/editar-reserva/:id" element={<EditarReservaForm />} />
                        <Route path="/reserva/:id" element={<DetallesReserva />} /> */}


                    </Routes>

                    {/* Navbar y Footer solo se muestran en las rutas generales */}

                    {/* <Footer /> Footer global */}
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
