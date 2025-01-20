import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext"; // Importar el contexto de Flux
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai"; // React Icons
import { BsArrowRight } from "react-icons/bs"; // React Icons
import "../../styles/register.css";

export const Register = () => {
  const { actions } = useContext(Context); // Acceder a las acciones del Flux
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    language: "es",

  });
  const [activeTab, setActiveTab] = useState("login"); // Controlar si es login o signup
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Inicializar useNavigate para redirección

  // Para prevenir la actualización de estado en un componente desmontado
  const [isMounted, setIsMounted] = useState(true);

  // Usamos un ref para evitar actualizar el estado cuando el componente se desmonta
  const isMountedRef = React.useRef(true);

  useEffect(() => {
    // Marca el componente como montado
    isMountedRef.current = true;
    return () => {
      // Cuando el componente se desmonta, actualizamos el ref
      isMountedRef.current = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { email, password, language } = formData;
  
    if (activeTab === "login") {
      const result = await actions.login(email, password);
      if (isMountedRef.current) setMessage(result.message);
    } else {
      // Incluye 'language' al enviar la solicitud de registro
      const result = await actions.signup(email, password, language); // Añadir 'language' aquí
      if (isMountedRef.current) {
        if (result.success) {
          alert("Usuario registrado exitosamente.");
          setFormData({ email: "", password: "", language: "es" }); // Limpiar el formulario y resetear 'language'
          setActiveTab("login");
          navigate("/userhome");
        } else {
          setMessage(result.message);
        }
      }
    }
  };

  return (
    <div>
      <div className="section">
        <div className="container">
          <div className="row full-height justify-content-center">
            <div className="col-12 text-center align-self-center py-5">
              <div className="section pb-5 pt-5 pt-sm-2 text-center">
                <h6 className="mb-0 pb-3">
                  <span onClick={() => setActiveTab("login")}>Log In</span>
                  <span onClick={() => setActiveTab("signup")}>Sign Up</span>
                </h6>
                <input
                  className="checkbox"
                  type="checkbox"
                  id="reg-log"
                  name="reg-log"
                  checked={activeTab === "signup"}
                  onChange={() =>
                    setActiveTab(activeTab === "login" ? "signup" : "login")
                  }
                />
                <label htmlFor="reg-log"></label>
                <div className="card-3d-wrap mx-auto">
                  <div className="card-3d-wrapper">
                    {activeTab === "login" && (
                      <div className="card-front">
                        <div className="center-wrap">
                          <form className="section text-center" onSubmit={handleSubmit}>
                            <h4 className="mb-4 pb-3">Log In</h4>
                            <div className="form-group">
                              <input
                                type="email"
                                className="form-style"
                                id="email-login"
                                name="email"
                                placeholder="Su Correo Electrónico"
                                value={formData.email}
                                onChange={handleChange}
                              />
                              <AiOutlineMail className="input-icon" />
                            </div>
                            <div className="form-group mt-2">
                              <input
                                type="password"
                                className="form-style"
                                id="password-login"
                                name="password"
                                placeholder="Su Contraseña"
                                value={formData.password}
                                onChange={handleChange}
                              />
                              <AiOutlineLock className="input-icon" />
                            </div>
                            <button type="submit" className="btn mt-4">
                              <BsArrowRight className="arrow-icon" />
                            </button>
                            <p className="mb-0 mt-4 text-center">
                              <a href="#0" className="link">
                                Forgot your password?
                              </a>
                            </p>
                          </form>
                        </div>
                      </div>
                    )}
                    {activeTab === "signup" && (
                      <div className="card-back">
                        <div className="center-wrap">
                          <form className="section text-center" onSubmit={handleSubmit}>
                            <h4 className="mb-4 pb-3">Sign Up</h4>
                            <div className="form-group mt-2">
                              <input
                                type="email"
                                className="form-style"
                                id="email-signup"
                                name="email"
                                placeholder="Su Correo Electrónico"
                                value={formData.email}
                                onChange={handleChange}
                              />
                              <AiOutlineMail className="input-icon" />
                            </div>
                            <div className="form-group mt-2">
                              <input
                                type="password"
                                className="form-style"
                                id="password-signup"
                                name="password"
                                placeholder="Su Contraseña"
                                value={formData.password}
                                onChange={handleChange}
                              />
                              <AiOutlineLock className="input-icon" />
                            </div>
                            <div className="form-group mt-2">
                              <select
                                className="form-style"
                                id='language'
                                name= "language"
                                value={formData.language}
                                onChange={handleChange}
                                >
                                  <option value="es"> Español (es)</option>
                                  <option value="en"> Inglés (en)</option>
                              </select>
                            </div>
                            <button type="submit" className="btn mt-4">
                              <BsArrowRight className="arrow-icon" />
                            </button>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {message && <p className="mt-4">{message}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};