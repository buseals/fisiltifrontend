import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import Profile from "./pages/Profile";
import Settings from "./pages/SettingsPage";
import AdminPage from "./pages/AdminPage";

function App() {

  // ⭐ Uygulama açıldığında admin yoksa otomatik ekle
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const adminExists = users.some(
      (u) => u.email === "admin@gmail.com"
    );

    if (!adminExists) {
      users.push({
        name: "Admin",
        email: "admin@gmail.com",
        password: "123456",
        role: "admin",
      });

      localStorage.setItem("users", JSON.stringify(users));
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* ⭐ Giriş / Kayıt Sayfası */}
        <Route path="/" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />

        {/* ⭐ Şifre Sıfırlama */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* ⭐ Normal Kullanıcı Ana Sayfası */}
        <Route path="/home" element={<HomePage />} />

        {/* ⭐ Profil */}
        <Route path="/profile" element={<Profile />} />

        {/* ⭐ Ayarlar */}
        <Route path="/settings" element={<Settings />} />

        {/* ⭐ Admin Paneli */}
        <Route path="/admin" element={<AdminPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
