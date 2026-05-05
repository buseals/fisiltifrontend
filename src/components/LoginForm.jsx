import { useState } from "react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form">

      <div className="input-wrapper">
        <span className="input-icon">📧</span>
        <input className="input" type="email" placeholder="E-posta" />
      </div>

      <div className="password-wrapper">
        <span className="input-icon">🔒</span>

        <input
          className="input"
          type={showPassword ? "text" : "password"}
          placeholder="Şifre"
        />

        <span
          className="eye-icon"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "👁️" : "👁️‍🗨️"}
        </span>
      </div>

      <div className="error-message">
        E-posta veya şifre hatalı.
      </div>

      <button className="btn">Giriş Yap</button>
    </div>
  );
}
