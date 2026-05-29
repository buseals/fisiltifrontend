import { useState } from "react";

export default function RegisterForm({ onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    // ⭐ Yeni kullanıcı objesi
    const newUser = {
      name,
      email,
      password,
      role: "user",
    };

    // ⭐ Var olan kullanıcıları al (yoksa boş dizi)
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // ⭐ Aynı email varsa hata ver
    if (users.some((u) => u.email === email)) {
      setError("Bu e‑posta zaten kayıtlı.");
      setLoading(false);
      return;
    }

    // ⭐ Yeni kullanıcıyı listeye ekle
    users.push(newUser);

    // ⭐ Güncellenmiş kullanıcı listesini kaydet
    localStorage.setItem("users", JSON.stringify(users));

    setMessage("Kayıt başarılı! Giriş yapabilirsin.");
    setLoading(false);

    // ⭐ 1 saniye sonra login moduna dön
    setTimeout(() => {
      onSwitch();
    }, 1000);
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
