import React, { useContext, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { FaArrowLeft, FaBars, FaHome, FaUser, FaQrcode, FaHistory, FaCheck, FaCalendarAlt } from "react-icons/fa";
import "../../styles/QrGenerator.css";

const isValidDate = (dateStr) => {
   // Verifica el formato DD/MM/YY
   if (!/^\d{2}\/\d{2}\/\d{2}$/.test(dateStr)) {
      return false;
   }

   const [day, month, year] = dateStr.split('/').map(num => parseInt(num, 10));
   const fullYear = 2000 + year; // Convertir año de dos dígitos a cuatro dígitos
   const date = new Date(fullYear, month - 1, day);

   // Verifica si es una fecha válida
   return date &&
      date.getDate() === day &&
      date.getMonth() === month - 1 &&
      date.getFullYear() === fullYear;
};

const getDateFromString = (dateStr) => {
   const [day, month, year] = dateStr.split('/').map(num => parseInt(num, 10));
   return new Date(2000 + year, month - 1, day);
};

const QrCard = ({
   formData,
   setFormData,
   isSubmitted,
   setIsSubmitted,
   localError,
   setLocalError,
   handleSubmit,
   handleIndividualQR,
   handleReset
}) => {
   const validateDate = (value, field) => {
      if (!value) {
         setLocalError(`La fecha de ${field === 'startDate' ? 'inicio' : 'fin'} es requerida`);
         return false;
      }

      if (!isValidDate(value)) {
         setLocalError(`Formato de fecha inválido para ${field === 'startDate' ? 'inicio' : 'fin'}. Use DD/MM/YY`);
         return false;
      }

      if (field === 'endDate' && formData.startDate) {
         const startDate = getDateFromString(formData.startDate);
         const endDate = getDateFromString(value);
         
         if (endDate < startDate) {
            setLocalError('La fecha de fin no puede ser anterior a la fecha de inicio');
            return false;
         }
      }

      setLocalError(null);
      return true;
   };

   const handleDateChange = (e, field) => {
      const { value } = e.target;
      setFormData({ ...formData, [field]: value });
      
      // Solo validamos si el usuario ha ingresado una fecha completa
      if (value.length === 8) {
         // Autoformateamos la fecha añadiendo los /
         const formattedDate = value.replace(/(\d{2})(\d{2})(\d{2})/, '$1/$2/$3');
         setFormData({ ...formData, [field]: formattedDate });
         validateDate(formattedDate, field);
      } else if (value.length === 0) {
         setLocalError(null);
      }
   };

   return isSubmitted ? (
      <div className="qr-card success">
         <div className="card-content">
            <FaCheck className="success-icon" />
            <p>¡QR generado exitosamente!</p>
            <button className="button primary-button full-width" onClick={handleReset}>
               Generar otro QR
            </button>
         </div>
      </div>
   ) : (
      <div className="qr-card">
         <div className="card-content">
            <form onSubmit={handleSubmit} className="qr-form">
               <div className="form-group">
                  <label htmlFor="qrName">Nombre del QR:</label>
                  <input
                     id="qrName"
                     type="text"
                     name="name"
                     value={formData.name}
                     onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        setLocalError(null);
                     }}
                     className="form-input"
                     placeholder="Nombre del QR"
                  />
               </div>

               <div className="form-group">
                  <label htmlFor="event">Evento *</label>
                  <div className="select-wrapper">
                     <select
                        id="event"
                        name="event"
                        value={formData.event}
                        onChange={(e) => {
                           setFormData({ ...formData, event: e.target.value });
                           setLocalError(null);
                        }}
                        className="form-select"
                        required
                     >
                        <option value="">Selecciona un evento</option>
                        <option value="event1">Evento 1</option>
                        <option value="event2">Evento 2</option>
                     </select>
                  </div>
               </div>

               <div className="date-container">
                  <div className="form-group">
                     <label htmlFor="startDate">Inicio: *</label>
                     <div className="date-input-wrapper">
                        <input
                           id="startDate"
                           type="text"
                           name="startDate"
                           value={formData.startDate}
                           onChange={(e) => handleDateChange(e, 'startDate')}
                           onBlur={(e) => validateDate(e.target.value, 'startDate')}
                           placeholder="DD/MM/YY"
                           className="form-input"
                           maxLength="8"
                           required
                        />
                        <FaCalendarAlt className="calendar-icon" />
                     </div>
                  </div>

                  <div className="form-group">
                     <label htmlFor="endDate">Fin: *</label>
                     <div className="date-input-wrapper">
                        <input
                           id="endDate"
                           type="text"
                           name="endDate"
                           value={formData.endDate}
                           onChange={(e) => handleDateChange(e, 'endDate')}
                           onBlur={(e) => validateDate(e.target.value, 'endDate')}
                           placeholder="DD/MM/YY"
                           className="form-input"
                           maxLength="8"
                           required
                        />
                        <FaCalendarAlt className="calendar-icon" />
                     </div>
                  </div>
               </div>

               {localError && <div className="error-message">{localError}</div>}

               <div className="button-container">
                  <button
                     type="button"
                     className="button secondary-button"
                     onClick={handleIndividualQR}
                  >
                     Generar QR individual
                  </button>
                  <button
                     type="submit"
                     className="button primary-button"
                     disabled={!formData.event || !formData.startDate || !formData.endDate || localError}
                  >
                     Generar QR grupal
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

const QrGenerator = () => {
   const { actions } = useContext(Context);
   const navigate = useNavigate();
   const [validToken, setValidToken] = useState(null);
   const [formData, setFormData] = useState({
      name: '',
      event: '',
      startDate: '',
      endDate: ''
   });
   const [isSubmitted, setIsSubmitted] = useState(false);
   const [localError, setLocalError] = useState(null);

   useEffect(() => {
      const localToken = localStorage.getItem("authToken");
      setValidToken(!!localToken && localToken.trim() !== "");
   }, []);

   const validateForm = () => {
      if (!formData.event || !formData.startDate || !formData.endDate) {
         setLocalError("Por favor completa todos los campos obligatorios");
         return false;
      }

      // Validar fechas
      if (!isValidDate(formData.startDate)) {
         setLocalError("Fecha de inicio inválida");
         return false;
      }

      if (!isValidDate(formData.endDate)) {
         setLocalError("Fecha de fin inválida");
         return false;
      }

      const startDate = getDateFromString(formData.startDate);
      const endDate = getDateFromString(formData.endDate);
      
      if (endDate < startDate) {
         setLocalError("La fecha de fin no puede ser anterior a la fecha de inicio");
         return false;
      }

      return true;
   };

   const handleLogout = () => {
      localStorage.removeItem("authToken");
      actions.setAuthToken(null);
      navigate("/login");
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      if (validateForm()) {
         console.log('Generando QR grupal...');
         setIsSubmitted(true);
      }
   };

   const handleIndividualQR = () => {
      if (validateForm()) {
         console.log('Generando QR individual...');
         setIsSubmitted(true);
      }
   };

   const handleReset = () => {
      setFormData({
         name: '',
         event: '',
         startDate: '',
         endDate: ''
      });
      setIsSubmitted(false);
      setLocalError(null);
   };

   if (validToken === null) return <h1>Cargando...</h1>;
   if (!validToken) return <Navigate to="/login" replace />;

   return (
      <div className="qr-generator-container">
         <header className="top-navbar">
            <button className="nav-button" onClick={handleLogout}>
               <FaArrowLeft />
            </button>
            <h1>QR Generator</h1>
            <button className="nav-button" onClick={() => navigate("/")}>
               <FaBars />
            </button>
         </header>

         <main className="main-content">
            <QrCard
               formData={formData}
               setFormData={setFormData}
               isSubmitted={isSubmitted}
               setIsSubmitted={setIsSubmitted}
               localError={localError}
               setLocalError={setLocalError}
               handleSubmit={handleSubmit}
               handleIndividualQR={handleIndividualQR}
               handleReset={handleReset}
            />
         </main>

         <nav className="bottom-nav">
            <button className="nav-item" onClick={() => navigate("/userhome")}>
               <FaHome />
            </button>
            <button className="nav-item" onClick={() => navigate("/userinfo")}>
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

export default QrGenerator;