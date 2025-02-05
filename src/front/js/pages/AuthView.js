import React, { useState } from "react";
import { Login } from "./Login";
import { Register } from "./Register";
import "../../styles/authView.css";

export const AuthView = () => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="auth-view-container">
      <div className="auth-header">
        <h2>{activeTab === "login" ? "Login" : "Register"}</h2>
        <p>
          {activeTab === "login" ? (
            <span onClick={() => setActiveTab("register")}>Create an Account</span>
          ) : (
            <span onClick={() => setActiveTab("login")}>Login Instead</span>
          )}
        </p>
      </div>

      <div className="auth-body">
        {activeTab === "login" ? <Login /> : <Register />}
      </div>
    </div>
  );
};