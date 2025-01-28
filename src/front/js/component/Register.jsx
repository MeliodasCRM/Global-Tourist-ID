import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { useNavigate } from "react-router-dom"; // ✅ Importar useNavigate
import "../../styles/register.css";

export const Register = () => {
  const { actions } = useContext(Context);
  const navigate = useNavigate(); // ✅ Inicializar navegación
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    language: "es"
  });
  const [activeTab, setActiveTab] = useState("login");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeTab === "login") {
      await actions.login(formData.email, formData.password);
    } else {
      const result = await actions.signup(formData.email, formData.password, formData.language);
      if (result.success) {
        alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
        setActiveTab("login"); // ✅ Cambia a la pestaña de login
        setFormData({ email: "", password: "", language: "es" }); // ✅ Limpia los campos
        navigate("/login"); // ✅ Redirige al login
      } else {
        alert("❌ Error en el registro. Inténtalo de nuevo.");
      }
    }
  };

  return (
    <div className="auth-container">
      {/* 1️⃣ Caja superior (Welcome / Create Account) */}
      <div className="auth-header">
        <h2>{activeTab === "login" ? "Welcome back!" : "Create an account!"}</h2>
        <p>
          {activeTab === "login" ? "Login below or " : "Enter your account details below or "}
          <span className="switch-tab" onClick={() => setActiveTab(activeTab === "login" ? "signup" : "login")}>
            {activeTab === "login" ? "create an account" : "Log In"}
          </span>
        </p>
      </div>

      {/* 2️⃣ Caja intermedia (Formulario - SOLO INPUTS) */}
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <AiOutlineMail className="input-icon" />
        </div>

        <div className="input-wrapper">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <AiOutlineLock className="input-icon" />
        </div>

        {/* Selector de idioma solo en Sign Up */}
        {activeTab === "signup" && (
          <div className="input-wrapper">
            <label htmlFor="language">Language</label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
            >
              <option value="es">Español (es)</option>
              <option value="en">Inglés (en)</option>
            </select>
          </div>
        )}
      </form>

      {/* 3️⃣ Caja inferior (QR y Botón - FUERA DEL FORMULARIO) */}
      <div className="auth-footer">
        <div className="divider"></div> {/* Línea divisora */}

        {/* QR Code en lugar del texto */}
        <div className="qr-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="qr-icon"
          >
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
            <path d="M14 14h1v1h-1zm3 0h1v1h-1zm0 3h1v1h-1zm-3 3h1v1h-1zm3 0h1v1h-1zm3-3h1v1h-1z"></path>
          </svg>
        </div>

        {/* Botón de login/signup */}
        <button className="auth-button" onClick={handleSubmit}>
          {activeTab === "login" ? "Login" : "Sign Up"}
        </button>
      </div>
    </div>
  );
};
