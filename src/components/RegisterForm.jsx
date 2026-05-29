import { useState } from "react";

export default function RegisterForm({ onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const checkPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 2) return "zayıf";
    if (score === 3) return "orta";
    return "güçlü";
  };

  const getStrengthColor = (strength) => {
    if (strength === "zayıf") return "red";
    if (strength === "orta") return "orange";
    return "limegreen";
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const strength = checkPasswordStrength(password);
    if (strength === "zayıf") {
      setError("Şifre çok zayıf. Lütfen daha güçlü bir şifre belirleyin.");
      setLoading(false);
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some((u) => u.email === email)) {
      setError("Bu e‑posta zaten kayıtlı.");
      setLoading(false);
      return;
    }

    const newUser = {
      name,
      email,
      password,
      role: "user",
      joinDate: new Date().toLocaleDateString(),
      username: "@" + name.toLowerCase().replace(/\s+/g, "_")
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    setMessage("Kayıt başarılı! Giriş yapabilirsin.");
    setLoading(false);

    setTimeout(() => onSwitch(), 1000);
  };

  return (
    <form className="form" onSubmit={handleRegister}>
      <div className="input-wrapper">
        <span className="input-icon">👤</span>
        <input
          className="input"
          type="text"
          placeholder="İsim"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="input-wrapper">
        <span className="input-icon">📧</span>
        <input
          className="input"
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="password-wrapper">
        <span className="input-icon">🔒</span>
        <input
          className="input"
          type={showPassword ? "text" : "password"}
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <span
          className="eye-icon"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "👁️" : "👁️‍🗨️"}
        </span>
      </div>

      {password.length > 0 && (
        <p
          className="password-strength"
          style={{
            color: getStrengthColor(checkPasswordStrength(password)),
            marginTop: "5px",
            fontSize: "14px"
          }}
        >
          Güç: {checkPasswordStrength(password)}
        </p>
      )}

      <button className="btn" disabled={loading}>
        {loading ? "Kaydediliyor..." : "Kayıt Ol"}
      </button>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="login-links">
        <p>
          Zaten hesabın var mı{" "}
          <span className="login-link" onClick={onSwitch}>
            Giriş Yap
          </span>
        </p>
      </div>
    </form>
  );
}
