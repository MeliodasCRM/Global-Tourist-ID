import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import "../../styles/register.css";

export const Register = () => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    language: "es",
  });
  const [activeTab, setActiveTab] = useState("login");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newErrors = {};
  
    // Validación de email
    if (!formData.email.trim()) {
      newErrors.email = "El correo es requerido.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Por favor, introduce un correo válido.";
    }
  
    // Validación de contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida.";
    } else if (activeTab === "signup" && !validatePassword(formData.password)) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.";
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.email) alert(newErrors.email);
      if (newErrors.password) alert(newErrors.password);
      return;
    }
  
    // Lógica de autenticación
    if (activeTab === "login") {
      const loginSuccess = await actions.login(formData.email, formData.password);
      if (!loginSuccess) {
        alert("Correo o contraseña incorrectos"); // Nueva alerta para login fallido
      }
    } else {
      const result = await actions.signup(
        formData.email,
        formData.password,
        formData.language
      );
      if (result.success) {
        alert("Registro exitoso. Ahora puedes iniciar sesión.");
        setActiveTab("login");
        setFormData({ email: "", password: "", language: "es" });
        navigate("/login");
      } else {
        alert("Error en el registro. Inténtalo de nuevo.");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>{activeTab === "login" ? "Welcome back!" : "Create an account!"}</h2>
        <p>
          {activeTab === "login" ? "Login below or " : "Enter your account details below or "}
          <span
            className="switch-tab underline-blue"
            onClick={() => setActiveTab(activeTab === "login" ? "signup" : "login")}
          >
            {activeTab === "login" ? "create an account" : "Log In"}
          </span>
        </p>
      </div>

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
          />
          <AiOutlineMail className="input-icon" />
          {errors.email && <span className="error-message">{errors.email}</span>}
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
          />
          <AiOutlineLock className="input-icon" />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

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

      <div className="auth-footer">
        <div className="divider"></div>
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

        <button className="auth-button" onClick={handleSubmit}>
          {activeTab === "login" ? "Login" : "Sign Up"}
        </button>
      </div>
    </div>
  );
};