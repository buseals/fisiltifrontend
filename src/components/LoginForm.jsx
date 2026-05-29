import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // ⭐ Tüm kullanıcıları al
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // ⭐ Email + Şifre eşleşen kullanıcıyı bul
    const savedUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!savedUser) {
      setError("E‑posta veya şifre hatalı.");
      setLoading(false);
      return;
    }

    // ⭐ Username'i otomatik oluştur (buse → @buse)
    const username =
      savedUser.name
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "") || "kullanici";

    // ⭐ Giriş yapan kullanıcıyı doğru formatta kaydet
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: savedUser.name,
        email: savedUser.email,
        username: "@" + username,
        role: savedUser.role,
      })
    );

    // ⭐ Rol kontrolü
    if (savedUser.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/home");
    }
  };

  return (
    <form className="form" onSubmit={handleLogin}>
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
        {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
      </button>

      {error && <p className="error-message">{error}</p>}

      <div className="forgot-password">
        <p className="forgot-link" onClick={() => navigate("/forgot-password")}>
          Şifremi Unuttum
        </p>
      </div>

      <div className="login-links">
        <p>
          Hesabın yok mu{" "}
          <span className="register-link" onClick={onSwitch}>
            Kayıt Ol
          </span>
        </p>
      </div>
    </form>
  );
}
