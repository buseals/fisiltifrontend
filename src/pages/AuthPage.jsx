import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import "../styles/auth.css";

export default function AuthPage() {
  const [mode, setMode] = useState("login");

  return (
    <div className="auth-container">
      <div className="slogan-center">
        Sessizce paylaş, sadece takip ettiklerin duysun.
      </div>

      <div className="auth-box">
        <div className="logo-row">
          <img 
            src="/assets/fisilti-icon.png"
            alt="Fısıltı ikon"
            className="fisilti-icon"
          />
          <h1 className="logo-text">FISILTI</h1>
        </div>

        {mode === "login" ? (
          <LoginForm onSwitch={() => setMode("register")} />
        ) : (
          <RegisterForm onSwitch={() => setMode("login")} />
        )}
      </div>
    </div>
  );
}
