import React, { useContext, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { FaArrowLeft, FaBars, FaHome, FaUser, FaQrcode, FaHistory, FaCheck } from "react-icons/fa";
import "../../styles/QrShare.css";

const EmailCard = ({
   email,
   setEmail,
   accepted,
   setAccepted,
   isSubmitted,
   setIsSubmitted,
   localError,
   setLocalError,
   handleSubmit,
   handleCancel
}) => {
   return isSubmitted ? (
      <div className="email-card success">
         <div className="card-content">
            <FaCheck className="success-icon" />
            <p>¡Solicitud completada exitosamente!</p>
            <button className="button primary-button full-width" onClick={() => setIsSubmitted(false)}>
               Aceptar
            </button>
         </div>
      </div>
   ) : (
      <div className="email-card">
         <div className="card-content">
            <div className="input-header">
               <FaQrcode className="check-icon" />
               <label htmlFor="emailInput" className="input-label">
                  Ingresa el email para compartir
               </label>
            </div>

            <input
               id="emailInput"
               type="email"
               value={email}
               onChange={(e) => {
                  setEmail(e.target.value);
                  setLocalError(null);
               }}
               placeholder="ejemplo@correo.com"
               className="email-input"
               autoFocus
            />

            {localError && <div className="error-message">{localError}</div>}

            <div className="checkbox-container">
               <label htmlFor="terms" className="checkbox-label">
                  <div className="checkbox-wrapper">
                     <input
                        type="checkbox"
                        id="terms"
                        className="terms-checkbox"
                        checked={accepted}
                        onChange={(e) => setAccepted(e.target.checked)}
                     />
                     <span className="checkmark"></span>
                  </div>
                  <span className="checkbox-text">
                     Acepto compartir mi QR según los términos del servicio
                  </span>
               </label>
            </div>

            <div className="button-container">
               <button className="button secondary-button" onClick={handleCancel}>
                  Cancelar
               </button>
               <button
                  className="button primary-button"
                  onClick={handleSubmit}
                  disabled={!email || !accepted}
               >
                  Compartir
               </button>
            </div>
         </div>
      </div>
   );
};

const QrShare = () => {
   const { actions } = useContext(Context);
   const navigate = useNavigate();
   const [validToken, setValidToken] = useState(null);
   const [email, setEmail] = useState('');
   const [accepted, setAccepted] = useState(false);
   const [isSubmitted, setIsSubmitted] = useState(false);
   const [localError, setLocalError] = useState(null);

   useEffect(() => {
      const localToken = localStorage.getItem("authToken");
      setValidToken(!!localToken && localToken.trim() !== "");
   }, []);

   const handleLogout = () => {
      localStorage.removeItem("authToken");
      actions.setAuthToken(null);
      navigate("/login");
   };

   const handleSubmit = () => {
      if (!email || !accepted) return;

      if (!/\S+@\S+\.\S+/.test(email)) {
         setLocalError("Por favor ingresa un email válido");
         return;
      }

      setIsSubmitted(true);
      setEmail('');
      setAccepted(false);
      setLocalError(null);
   };

   const handleCancel = () => {
      setEmail('');
      setAccepted(false);
      setLocalError(null);
      setIsSubmitted(false);
   };

   if (validToken === null) return <h1>Cargando...</h1>;
   if (!validToken) return <Navigate to="/login" replace />;

   return (
      <div className="qr-share-container">
         <header className="top-navbar">
            <button className="nav-button" onClick={handleLogout}>
               <FaArrowLeft />
            </button>
            <h1>Sharing QR</h1>
            <button className="nav-button" onClick={() => navigate("/")}>
               <FaBars />
            </button>
         </header>

         <main className="main-content">
            <EmailCard
               email={email}
               setEmail={setEmail}
               accepted={accepted}
               setAccepted={setAccepted}
               isSubmitted={isSubmitted}
               setIsSubmitted={setIsSubmitted}
               localError={localError}
               setLocalError={setLocalError}
               handleSubmit={handleSubmit}
               handleCancel={handleCancel}
            />
         </main>

         <nav className="bottom-nav">
            <button className="nav-item" onClick={() => navigate("/")}>
               <FaHome />
            </button>
            <button className="nav-item" onClick={() => navigate("/profile")}>
               <FaUser />
            </button>
            <button className="nav-item active">
               <FaQrcode />
            </button>
            <button className="nav-item" onClick={() => navigate("/history")}>
               <FaHistory />
            </button>
         </nav>
      </div>
   );
};

export default QrShare;