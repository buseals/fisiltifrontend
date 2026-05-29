import { useState } from "react";
import "../styles/auth.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
        body: JSON.stringify({ email }),
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
          E‑posta adresini gir, sana şifre sıfırlama bağlantısı gönderelim.
        </p>

        <form className="form" onSubmit={handleSubmit}>
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
