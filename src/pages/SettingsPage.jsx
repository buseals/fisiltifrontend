import { useState } from "react";
import "../styles/settings.css";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");

  // ⭐ Kullanıcıyı güvenli şekilde al
  const storedUser = JSON.parse(localStorage.getItem("user") || "null") || {
    name: "",
    username: "@kullanici",
    email: "",
    joinDate: "12/03/2026"
  };

  const [userInfo, setUserInfo] = useState({
    name: storedUser.name || "",
    username: storedUser.username || "@kullanici",
    email: storedUser.email || "",
    joinDate: storedUser.joinDate || "12/03/2026"
  });

  const [editForm, setEditForm] = useState({ ...userInfo });

  // ⭐ Bildirim ayarı
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem("notifSetting") === "on"
  );

  const toggleNotifications = (value) => {
    setNotificationsEnabled(value === "on");
    localStorage.setItem("notifSetting", value);
  };

  const handleLogout = () => {
    window.location.href = "/";
  };

  // ⭐ Şifre alanları
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    newPasswordAgain: ""
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordAgain, setShowNewPasswordAgain] = useState(false);

  // ⭐ Şifre Güç Kontrolü
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

  // ⭐ Bilgileri Kaydet
  const handleSave = () => {
    const updatedUser = {
      ...storedUser,
      name: editForm.name,
      username:
        "@" +
        (editForm.username || "")
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^a-z0-9_]/g, ""),
      email: editForm.email,
      joinDate: editForm.joinDate || "12/03/2026"
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUserInfo(updatedUser);

    alert("Bilgiler güncellendi!");
    setActiveTab("account");
  };

  // ⭐ Şifre Kaydet
  const handlePasswordSave = () => {
    const currentPassword = localStorage.getItem("password");

    if (
      !passwordForm.oldPassword ||
      !passwordForm.newPassword ||
      !passwordForm.newPasswordAgain
    ) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    if (passwordForm.oldPassword !== currentPassword) {
      alert("Eski şifre yanlış.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.newPasswordAgain) {
      alert("Yeni şifreler eşleşmiyor.");
      return;
    }

    const strength = checkPasswordStrength(passwordForm.newPassword);

    if (strength === "zayıf") {
      alert("Şifre çok zayıf. Lütfen daha güçlü bir şifre belirleyin.");
      return;
    }

    localStorage.setItem("password", passwordForm.newPassword);

    alert("Şifre başarıyla değiştirildi!");

    setPasswordForm({
      oldPassword: "",
      newPassword: "",
      newPasswordAgain: ""
    });

    setActiveTab("account");
  };

  return (
    <div className="settings-container">
      <div className="app-logo">
        <img src="/assets/fisilti-icon.png" alt="logo" />
      </div>

      <div className="settings-sidebar">
        <h2 className="settings-title">Ayarlar</h2>

        <button
          className={`settings-btn ${activeTab === "account" ? "active" : ""}`}
          onClick={() => setActiveTab("account")}
        >
          Hesap Bilgileri
        </button>

        <button
          className={`settings-btn ${activeTab === "password" ? "active" : ""}`}
          onClick={() => setActiveTab("password")}
        >
          Şifre Değiştir
        </button>

        <button
          className={`settings-btn ${activeTab === "edit" ? "active" : ""}`}
          onClick={() => {
            setEditForm({ ...userInfo });
            setActiveTab("edit");
          }}
        >
          Bilgileri Düzenle
        </button>

        <button
          className={`settings-btn ${activeTab === "notifications" ? "active" : ""}`}
          onClick={() => setActiveTab("notifications")}
        >
          Bildirimler
        </button>

        <button className="settings-btn logout-btn" onClick={handleLogout}>
          Çıkış
        </button>
      </div>

      <div className="settings-content">
        <div className="settings-top-menu">
          <button
            className="settings-top-menu-btn glass-top-btn"
            onClick={() => (window.location.href = "/profile")}
          >
            ← Profile Dön
          </button>

          <button
            className="settings-top-menu-btn glass-top-btn"
            onClick={() => (window.location.href = "/home")}
          >
            Ana Sayfa →
          </button>
        </div>

        {/* ⭐ HESAP BİLGİLERİ PANELİ */}
        {activeTab === "account" && (
          <div className="panel glass-card">
            <h3 className="glass-title">Hesap Bilgileri</h3>

            <div className="info-block">
              <span className="info-label">Ad</span>
              <span className="info-value">{userInfo.name}</span>
            </div>

            <div className="info-block">
              <span className="info-label">Kullanıcı adı</span>
              <span className="info-value">{userInfo.username}</span>
            </div>

            <div className="info-block">
              <span className="info-label">E‑posta</span>
              <span className="info-value">{userInfo.email}</span>
            </div>

            <div className="info-block">
              <span className="info-label">Katılma tarihi</span>
              <span className="info-value">{userInfo.joinDate}</span>
            </div>

            <button
              className="panel-btn"
              onClick={() => {
                setEditForm({ ...userInfo });
                setActiveTab("edit");
              }}
            >
              Bilgileri Düzenle
            </button>
          </div>
        )}

        {/* ⭐ ŞİFRE DEĞİŞTİR PANELİ */}
        {activeTab === "password" && (
          <div className="panel glass-card">
            <h3 className="glass-title">Şifre Değiştir</h3>

            <label>Eski şifre:</label>
            <div className="password-wrapper">
              <input
                type={showOldPassword ? "text" : "password"}
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
                }
              />
              <span
                className="eye-icon"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>

            <label>Yeni şifre:</label>
            <div className="password-wrapper">
              <input
                type={showNewPassword ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
              />
              <span
                className="eye-icon"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>

            {/* ⭐ Şifre Güç Göstergesi */}
            <p
              className="password-strength"
              style={{
                color: getStrengthColor(
                  checkPasswordStrength(passwordForm.newPassword)
                ),
                marginTop: "5px",
                fontSize: "14px"
              }}
            >
              Güç: {checkPasswordStrength(passwordForm.newPassword)}
            </p>

            <label>Yeni şifre tekrar:</label>
            <div className="password-wrapper">
              <input
                type={showNewPasswordAgain ? "text" : "password"}
                value={passwordForm.newPasswordAgain}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPasswordAgain: e.target.value
                  })
                }
              />
              <span
                className="eye-icon"
                onClick={() =>
                  setShowNewPasswordAgain(!showNewPasswordAgain)
                }
              >
                {showNewPasswordAgain ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>

            <div className="panel-actions">
              <button className="panel-btn" onClick={handlePasswordSave}>
                Kaydet
              </button>
              <button
                className="panel-btn cancel"
                onClick={() => setActiveTab("account")}
              >
                İptal
              </button>
            </div>
          </div>
        )}

        {/* ⭐ BİLGİLERİ DÜZENLE PANELİ */}
        {activeTab === "edit" && (
          <div className="panel glass-card">
            <h3 className="glass-title">Bilgileri Düzenle</h3>

            <label>Ad:</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
            />

            <label>Kullanıcı adı:</label>
            <input
              type="text"
              value={editForm.username}
              onChange={(e) =>
                setEditForm({ ...editForm, username: e.target.value })
              }
            />

            <label>E‑posta:</label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
            />

            <label>Katılma tarihi:</label>
            <input
              type="text"
              value={editForm.joinDate}
              onChange={(e) =>
                setEditForm({ ...editForm, joinDate: e.target.value })
              }
            />

            <div className="panel-actions">
              <button className="panel-btn" onClick={handleSave}>
                Kaydet
              </button>

              <button
                className="panel-btn cancel"
                onClick={() => setActiveTab("account")}
              >
                İptal
              </button>
            </div>
          </div>
        )}

        {/* ⭐ BİLDİRİMLER PANELİ */}
        {activeTab === "notifications" && (
          <div className="panel glass-card">
            <h3 className="glass-title">Bildirimler</h3>

            <div className="toggle-row">
              <span>Bildirimler:</span>

              <button
                className={`toggle-btn ${notificationsEnabled ? "active" : ""}`}
                onClick={() => toggleNotifications("on")}
              >
                AÇ
              </button>

              <button
                className={`toggle-btn off ${!notificationsEnabled ? "active" : ""}`}
                onClick={() => toggleNotifications("off")}
              >
                KAPAT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
