import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext"; // Importar el contexto de Flux
import "../../styles/register.css";

export const Register = () => {
  const { actions } = useContext(Context); // Acceder a las acciones del Flux
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [activeTab, setActiveTab] = useState("login"); // Controlar si es login o signup
  const [message, setMessage] = useState("");

  // Controlar si el componente está montado
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    setIsMounted(true); // Marcar como montado
    return () => setIsMounted(false); // Marcar como desmontado
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (activeTab === "login") {
      const result = await actions.login(formData.email, formData.password);
      if (isMounted) setMessage(result.message);
    } else {
      const result = await actions.signup(
        formData.email,
        formData.password
      );
      if (isMounted) {
        if (result.success) {
          alert("Usuario registrado exitosamente.");
          setFormData({ email: "", password: "" }); // Limpiar formulario
          setActiveTab("login"); // Cambiar a login
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
                              <i className="input-icon uil uil-at"></i>
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
                              <i className="input-icon uil uil-lock-alt"></i>
                            </div>
                            <button type="submit" className="btn mt-4">
                              Submit
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
                              <i className="input-icon uil uil-at"></i>
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
                              <i className="input-icon uil uil-lock-alt"></i>
                            </div>
                            <button type="submit" className="btn mt-4">
                              Submit
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