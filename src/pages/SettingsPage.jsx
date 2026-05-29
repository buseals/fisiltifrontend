import { useState, useEffect } from "react";
import "../styles/settings.css";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");

  useEffect(() => {
    if (!localStorage.getItem("password")) {
      localStorage.setItem("password", "123456");
    }
  }, []);

  // ⭐ Bildirim ayarı artık notifSetting anahtarında tutuluyor
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

  const [userInfo, setUserInfo] = useState({
    joinDate: "12/03/2026",
    username: "Buse_1",
    email: "buse@gmail.com"
  });

  const [editForm, setEditForm] = useState({ ...userInfo });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    newPasswordAgain: ""
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordAgain, setShowNewPasswordAgain] = useState(false);

  const handleSave = () => {
    setUserInfo(editForm);
    setActiveTab("account");
  };

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
              <span className="info-label">Katılma tarihi</span>
              <span className="info-value">{userInfo.joinDate}</span>
            </div>

            <div className="info-block">
              <span className="info-label">Kullanıcı adı</span>
              <span className="info-value">{userInfo.username}</span>
            </div>

            <div className="info-block">
              <span className="info-label">E‑posta</span>
              <span className="info-value">{userInfo.email}</span>
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

            <label>Katılma tarihi:</label>
            <input
              type="text"
              value={editForm.joinDate}
              onChange={(e) =>
                setEditForm({ ...editForm, joinDate: e.target.value })
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
