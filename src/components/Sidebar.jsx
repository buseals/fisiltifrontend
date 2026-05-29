import { Link } from "react-router-dom";

export default function Sidebar({ onLogout }) {
  return (
    <div className="sidebar">
      <h3 className="sidebar-title">Menü</h3>

      <ul className="sidebar-list">
        <li><Link className="sidebar-link" to="/home">Ana Sayfa</Link></li>
        <li><Link className="sidebar-link" to="/profile">Profilim</Link></li>
        <li><Link className="sidebar-link" to="/settings">Ayarlar</Link></li>

        {/* ⭐ Çıkış Yap da artık link gibi görünsün ⭐ */}
        <li>
          <button className="sidebar-link sidebar-logout" onClick={onLogout}>
            Çıkış Yap
          </button>
        </li>
      </ul>
    </div>
  );
}
