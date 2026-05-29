import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";

import AdminDashboard from "./AdminDashboard";
import AdminReports from "./AdminReports";
import AdminUsers from "./AdminUsers";
import AdminPosts from "./AdminPosts";

import AdminNotificationBell from "../components/AdminNotificationBell";
import AdminNotificationList from "../components/AdminNotificationList";

export default function AdminPage() {
  const navigate = useNavigate();

  // ⭐ Sayfa state
  const [page, setPage] = useState("dashboard");

  // ⭐ Bildirim state
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState(
    JSON.parse(localStorage.getItem("adminNotifications")) || []
  );

  // ⭐ Bildirimleri LocalStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("adminNotifications", JSON.stringify(notifications));
  }, [notifications]);

  // ⭐ Kullanıcı bilgisi
  const user = JSON.parse(localStorage.getItem("user"));

  // ⭐ Admin değilse erişim yok
  if (!user || user.role !== "admin") {
    return (
      <div style={{ color: "white", padding: "40px", fontSize: "20px" }}>
        Bu sayfaya erişim iznin yok.
      </div>
    );
  }

  return (
    <div className="admin-layout">

      {/* ⭐ ÜST BAR */}
      <div className="admin-topbar">
        <AdminNotificationBell onOpen={() => setShowNotif(!showNotif)} />
      </div>

      {/* ⭐ BİLDİRİM PANELİ */}
      {showNotif && (
        <AdminNotificationList
          notifications={notifications}
          setNotifications={setNotifications}
          onClose={() => setShowNotif(false)}
        />
      )}

      {/* ⭐ SOL MENÜ */}
      <aside className="admin-sidebar">
        <h2 className="admin-title">Admin Paneli</h2>

        <button onClick={() => setPage("dashboard")}>Dashboard</button>
        <button onClick={() => setPage("reports")}>Raporlar</button>
        <button onClick={() => setPage("users")}>Kullanıcılar</button>
        <button onClick={() => setPage("posts")}>Gönderiler</button>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/");
          }}
        >
          Çıkış Yap
        </button>
      </aside>

      {/* ⭐ ANA İÇERİK */}
      <main className="admin-content">
        {page === "dashboard" && <AdminDashboard />}
        {page === "reports" && <AdminReports />}
        {page === "users" && <AdminUsers />}
        {page === "posts" && <AdminPosts />}
      </main>

    </div>
  );
}
