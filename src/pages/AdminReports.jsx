import { useState } from "react";
import "../styles/adminReports.css";

export default function AdminReports() {
  const [reports, setReports] = useState([
    {
      id: 1,
      user: "helin",
      message: "spam",
      date: "11.04.2026",
    },
    {
      id: 2,
      user: "irem",
      message: "Tenis öğreniyorum, fena değilmiş 😊",
      date: "11.04.2026",
    },
    {
      id: 3,
      user: "buse",
      message: "Uygunsuz içerik",
      date: "10.04.2026",
    },
    {
      id: 4,
      user: "zehra",
      message: "Hava bugün çok güzel 🌼",
      date: "10.04.2026",
    },
  ]);

  const handleAction = (id, action) => {
    if (action === "delete") {
      setReports(reports.filter((r) => r.id !== id));
    } else if (action === "ignore") {
      alert("Rapor yok sayıldı.");
    } else if (action === "keep") {
      alert("Gönderi yayında bırakıldı.");
    }
  };

  return (
    <div className="reports-container">
      <h1 className="reports-title">Raporlar</h1>

      <div className="reports-list">
        {reports.map((r) => (
          <div key={r.id} className="report-card">
            <div className="report-header">
              <span className="report-user">@{r.user}</span>
            </div>

            <p className="report-message">{r.message}</p>

            <span className="report-date">Rapor Tarihi: {r.date}</span>

            <div className="report-actions">
              <button
                className="btn ignore"
                onClick={() => handleAction(r.id, "ignore")}
              >
                yok say
              </button>

              <button
                className="btn keep"
                onClick={() => handleAction(r.id, "keep")}
              >
                yayında bırak
              </button>

              <button
                className="btn delete"
                onClick={() => handleAction(r.id, "delete")}
              >
                sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
