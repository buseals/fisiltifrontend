import { useState } from "react";
import "../styles/auth.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ⭐ Şifre gücü hesaplama fonksiyonu
  const checkPasswordStrength = (password) => {
    let score = 0;

    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return "Zayıf";
    if (score <= 3) return "Orta";
    return "Güçlü";
  };

  // ⭐ Şifre yazıldıkça gücü hesapla
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setStrength(checkPasswordStrength(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Şifre sıfırlama maili gönderildi!");
      } else {
        setError(data.message || "Bir hata oluştu.");
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı.");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">

        <h2 className="forgot-title">Şifre Sıfırlama</h2>

        <p className="forgot-desc">
          E‑posta adresini ve yeni şifreni gir. Sana sıfırlama bağlantısı gönderelim.
        </p>

        <form className="form" onSubmit={handleSubmit}>
          
          {/* ⭐ E‑posta */}
          <div className="input-wrapper">
            <span className="input-icon">📧</span>
            <input
              className="input"
              type="email"
              placeholder="E‑posta adresi"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* ⭐ Yeni Şifre */}
          <div className="input-wrapper">
            <span className="input-icon">🔒</span>
            <input
              className="input"
              type="password"
              placeholder="Yeni Şifre"
              value={password}
              onChange={handlePasswordChange}
              required
              disabled={loading}
            />
          </div>

          {/* ⭐ Şifre Gücü */}
          {password && (
            <p className={`strength ${strength.toLowerCase()}`}>
              Şifre Gücü: {strength}
            </p>
          )}

          <button className="btn" disabled={loading}>
            {loading ? "Gönderiliyor..." : "Mail Gönder"}
          </button>
        </form>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="login-links">
          <p>
            Geri dön →{" "}
            <span
              className="login-link"
              onClick={() => (window.location.href = "/")}
            >
              Giriş Yap
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}
