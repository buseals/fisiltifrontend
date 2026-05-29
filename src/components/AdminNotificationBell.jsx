import { useState, useEffect } from "react";
import "../styles/adminNotifications.css";

export default function AdminNotificationBell({ onOpen }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("adminNotifications")) || [];
    setNotifications(saved);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notif-bell" onClick={onOpen}>
      🔔
      {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
    </div>
  );
}
