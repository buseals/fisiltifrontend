import { useState } from "react";
import "../styles/adminUsers.css";
import AdminSearchBar from "../components/AdminSearchBar";

export default function AdminUsers() {
  const [users, setUsers] = useState([
    { id: 1, username: "buse", email: "buse@gmail.com", status: "aktif" },
    { id: 2, username: "helin", email: "helin@gmail.com", status: "aktif" },
    { id: 3, username: "irem", email: "irem@gmail.com", status: "engelli" },
    { id: 4, username: "zehra", email: "zehra@gmail.com", status: "aktif" },
  ]);

  // ⭐ Arama & Filtre state
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // ⭐ Filtrelenmiş kullanıcı listesi
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "active" && u.status === "aktif") ||
      (filter === "blocked" && u.status === "engelli");

    return matchesSearch && matchesFilter;
  });

  const handleAction = (id, action) => {
    if (action === "delete") {
      setUsers(users.filter((u) => u.id !== id));
    }

    if (action === "block") {
      setUsers(
        users.map((u) =>
          u.id === id ? { ...u, status: "engelli" } : u
        )
      );
    }

    if (action === "unblock") {
      setUsers(
        users.map((u) =>
          u.id === id ? { ...u, status: "aktif" } : u
        )
      );
    }
  };

  return (
    <div className="users-container">
      <h1 className="users-title">Kullanıcı Yönetimi</h1>

      {/* ⭐ Arama & Filtre */}
      <AdminSearchBar
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
      />

      <div className="users-list">
        {filteredUsers.map((u) => (
          <div key={u.id} className="user-card">
            <div className="user-info">
              <h3>@{u.username}</h3>
              <p>{u.email}</p>
              <span className={`status ${u.status}`}>
                Durum: {u.status}
              </span>
            </div>

            <div className="user-actions">
              {u.status === "aktif" ? (
                <button
                  className="btn block"
                  onClick={() => handleAction(u.id, "block")}
                >
                  Engelle
                </button>
              ) : (
                <button
                  className="btn unblock"
                  onClick={() => handleAction(u.id, "unblock")}
                >
                  Engeli Kaldır
                </button>
              )}

              <button
                className="btn delete"
                onClick={() => handleAction(u.id, "delete")}
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
