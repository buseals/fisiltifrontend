import { useState } from "react";
import "../styles/adminPosts.css";

export default function AdminPosts() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "buse",
      text: "Bugün hava çok güzel 🌸",
      status: "yayında",
      date: "12.04.2026",
    },
    {
      id: 2,
      user: "helin",
      text: "Spam içerik",
      status: "kaldırıldı",
      date: "11.04.2026",
    },
    {
      id: 3,
      user: "irem",
      text: "Tenis öğreniyorum 🎾",
      status: "yayında",
      date: "10.04.2026",
    },
  ]);

  const handleAction = (id, action) => {
    if (action === "delete") {
      setPosts(posts.filter((p) => p.id !== id));
    }

    if (action === "remove") {
      setPosts(
        posts.map((p) =>
          p.id === id ? { ...p, status: "kaldırıldı" } : p
        )
      );
    }

    if (action === "publish") {
      setPosts(
        posts.map((p) =>
          p.id === id ? { ...p, status: "yayında" } : p
        )
      );
    }
  };

  return (
    <div className="posts-container">
      <h1 className="posts-title">Gönderi Yönetimi</h1>

      <div className="posts-list">
        {posts.map((p) => (
          <div key={p.id} className="post-card">
            <div className="post-info">
              <h3>@{p.user}</h3>
              <p className="post-text">{p.text}</p>
              <span className={`post-status ${p.status}`}>
                Durum: {p.status}
              </span>
              <span className="post-date">Tarih: {p.date}</span>
            </div>

            <div className="post-actions">
              {p.status === "yayında" ? (
                <button
                  className="btn remove"
                  onClick={() => handleAction(p.id, "remove")}
                >
                  Yayından Kaldır
                </button>
              ) : (
                <button
                  className="btn publish"
                  onClick={() => handleAction(p.id, "publish")}
                >
                  Yayına Al
                </button>
              )}

              <button
                className="btn delete"
                onClick={() => handleAction(p.id, "delete")}
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
