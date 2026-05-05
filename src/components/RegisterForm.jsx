import { useState } from "react";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form">

      <div className="input-wrapper">
        <span className="input-icon">👤</span>
        <input className="input" type="text" placeholder="Kullanıcı adı" />
      </div>

      <div className="input-wrapper">
        <span className="input-icon">📧</span>
        <input className="input" type="email" placeholder="Email" />
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

      <button className="btn">Kayıt Ol</button>
    </div>
  );
}
