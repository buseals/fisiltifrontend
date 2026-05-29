import "../styles/adminNotifications.css";

export default function AdminNotificationList({
  notifications,
  setNotifications,
  onClose
}) {
  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem("adminNotifications", JSON.stringify(updated));
  };

  return (
    <div className="notif-panel">

      {/* Üst Başlık */}
      <div className="notif-header">
        <h3>Bildirimler</h3>
        <button className="notif-read" onClick={markAllRead}>
          Tümünü Okundu Yap
        </button>
      </div>

      {/* Bildirimler */}
      {notifications.length === 0 && (
        <p className="notif-empty">Hiç bildirimin yok.</p>
      )}

      {notifications.map((n) => (
        <div key={n.id} className={`notif-item ${n.read ? "read" : ""}`}>
          {n.text}
        </div>
      ))}

      {/* Alta alınmış minimal kapat butonu */}
      <button className="notif-close" onClick={onClose}>
        Kapat
      </button>
    </div>
  );
}
