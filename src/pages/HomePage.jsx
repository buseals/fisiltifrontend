import "../styles/home.css";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

export default function HomePage() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [posts, setPosts] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const defaultPosts = [
    { id: 1, user: "@buse", text: "Bugün çok güzel bir gün 🌸", time: Date.now() - 7200000, color: "rgba(255,255,255,0.04)" },
    { id: 2, user: "@helin", text: "Kahve molası ☕", time: Date.now() - 3600000, color: "rgba(255,255,255,0.04)" },
    { id: 3, user: "@mert", text: "Yeni şarkımı paylaştım 🎶", time: Date.now() - 600000, color: "rgba(255,255,255,0.04)" },
    { id: 4, user: "@ayşe", text: "Kitap okumak gibisi yok 📚", time: Date.now() - 1800000, color: "rgba(255,255,255,0.04)" }
  ];

 // ⭐ POSTS YÜKLENİRKEN ESKİ ZAMANLARI DÜZELT
useEffect(() => {
  const saved = localStorage.getItem("posts");

  // ⭐ defaultPosts artık burada tanımlı
  const defaultPosts = [
    {
      id: 1,
      username: "@buse",
      content: "Merhaba dünya!",
      time: Date.now(),
      color: "#ffb3c6",
      emoji: "🌸"
    },
    {
      id: 2,
      username: "@helin",
      content: "Bugün hava çok güzel!",
      time: Date.now() - 3600000,
      color: "#b3e5ff",
      emoji: "☀️"
    }
    // ... senin diğer default postların
  ];

  if (saved) {
    let loaded = JSON.parse(saved);

    loaded = loaded.map(p => {
      if (typeof p.time === "string") {
        const t = p.time;

        if (t.includes("şimdi")) return { ...p, time: Date.now() };
        if (t.includes("dakika")) return { ...p, time: Date.now() - parseInt(t) * 60000 };
        if (t.includes("saat")) return { ...p, time: Date.now() - parseInt(t) * 3600000 };
        if (t.includes("gün")) return { ...p, time: Date.now() - parseInt(t) * 86400000 };

        return { ...p, time: Date.now() };
      }
      return p;
    });

    setPosts(loaded);
    localStorage.setItem("posts", JSON.stringify(loaded));

  } else {
    setPosts(defaultPosts);
    localStorage.setItem("posts", JSON.stringify(defaultPosts));
  }
}, []); // ⭐ dependency array tekrar boş



  // ⭐ ADMIN PANELİNE KAYIT EKLEME
  const addAdminLog = (type, post) => {
    const logs = JSON.parse(localStorage.getItem("adminLogs") || "[]");

    const newLog = {
      id: Date.now(),
      type,
      postId: post.id,
      user: post.user,
      text: post.text,
      time: Date.now()
    };

    logs.push(newLog);
    localStorage.setItem("adminLogs", JSON.stringify(logs));
  };

  // ⭐ ZAMAN FORMATLAMA
  const formatTime = (timestamp) => {
    if (!timestamp || isNaN(timestamp)) return "şimdi";

    const now = Date.now();
    const diff = Math.floor((now - timestamp) / 1000);

    if (diff < 60) return "şimdi";
    if (diff < 3600) return `${Math.floor(diff / 60)} dakika önce`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`;
    return `${Math.floor(diff / 86400)} gün önce`;
  };

  // ⭐ ZAMANIN CANLI GÜNCELLENMESİ
  useEffect(() => {
    const interval = setInterval(() => {
      setPosts([...posts]);
    }, 60000);

    return () => clearInterval(interval);
  }, [posts]);

  // ⭐ ŞİKAYET ET
  const handleReport = (post) => {
    addAdminLog("şikayet", post);
    alert("Gönderi şikayet edildi!");
    setActiveMenu(null);
    setShowSubmenu(false);
  };

  // ⭐ ENGELLE
  const handleBlock = (post) => {
    addAdminLog("engelle", post);
    alert(post.user + " engellendi!");
    setActiveMenu(null);
    setShowSubmenu(false);
  };

  // ⭐ SPAM
  const handleSpam = (post) => {
    addAdminLog("spam", post);
    alert("Gönderi spam olarak işaretlendi!");
    setActiveMenu(null);
    setShowSubmenu(false);
  };

  const [postText, setPostText] = useState("");
  const [postColor, setPostColor] = useState("#1f2937");

  const getTextColor = (bgColor) => {
    if (!bgColor.startsWith("#")) return "#fff";
    const c = bgColor.substring(1);
    const rgb = parseInt(c, 16);
    const r = (rgb >> 16) & 255;
    const g = (rgb >> 8) & 255;
    const b = rgb & 255;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 140 ? "#000" : "#fff";
  };

  const handleShare = () => {
    if (postText.trim() === "") return;

    const newPost = {
      id: Date.now(),
      user: "@buse",
      text: postText,
      time: Date.now(),
      color: postColor
    };

    const updated = [newPost, ...posts];
    setPosts(updated);

    setPostText("");
    setPostColor("#1f2937");
    setShowPostForm(false);
  };

  // ⭐ RETURN BLOĞU
  return (
    <div className="home-container">

      {/* ÜST BAR */}
      <div className="topbar">
        <div className="topbar-content">

          <div className="logo-area">
            <div className="logo-icon-wrapper">
              <img src="/assets/fisilti-icon.png" className="logo-icon" alt="" />
            </div>

            <div className="logo-text">
              <span className="logo-title">FISILTI</span>
              <span className="logo-sub">Sessizce paylaş, sadece takip ettiklerin duysun.</span>
            </div>
          </div>

          <input type="text" className="search" placeholder="Ara..." />

          <button className="notif-btn" onClick={() => setShowNotifications(true)}>
            🔔
          </button>

          <button className="new-post-btn" onClick={() => setShowPostForm(true)}>
            + Yeni Gönderi
          </button>

        </div>
      </div>

      {/* GÖNDERİLER */}
      <div className="main-layout">

        <Sidebar
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          showSubmenu={showSubmenu}
          setShowSubmenu={setShowSubmenu}
          onLogout={handleLogout}
        />

        <div className="feed">
          {posts.map((post) => (
            <div
              key={post.id}
              className="post-card"
              style={{
                background: post.color,
                color: getTextColor(post.color)
              }}
            >

              <div className="post-header">
                <div className="post-user">{post.user}</div>

                <div
                  className="post-menu"
                  onClick={() => {
                    setActiveMenu(activeMenu === post.id ? null : post.id);
                    setShowSubmenu(false);
                  }}
                >
                  ⋮
                </div>
              </div>

              <div className="post-text">{post.text}</div>

              <div className="post-privacy">
                <span className="privacy-icon">🔒</span>
                Bu gönderiyi sadece takip ettiklerin görebilir
              </div>

              <div className="post-time">{formatTime(post.time)}</div>

              {activeMenu === post.id && (
                <div className="dropdown-menu">

                  <button className="dropdown-item" onClick={() => handleReport(post)}>
                    Şikayet Et
                  </button>

                  <div className="submenu">
                    <button className="dropdown-subitem" onClick={() => handleBlock(post)}>
                      Engelle
                    </button>

                    <button className="dropdown-subitem" onClick={() => handleSpam(post)}>
                      Spam
                    </button>
                  </div>

                </div>
              )}

            </div>
          ))}
        </div>

        <div className="rightbar">
          <h2>Trendler 🔥</h2>
          <ul>
            <li>#güneşliGün</li>
            <li>#kahveKeyfi</li>
            <li>#yeniŞarkı</li>
            <li>#mutluluk</li>
            <li>#fısıltıApp</li>
          </ul>
        </div>

      </div>

      {/* SAĞ ALTA SABİT BUTON */}
      <button className="floating-post-btn" onClick={() => setShowPostForm(true)}>
        ➕
      </button>

      {/* YENİ GÖNDERİ MODALI */}
      {showPostForm && (
        <div className="post-form-modal">

          <textarea
            className="post-input"
            style={{ background: postColor }}
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="Bugün ne fısıldayacaksın?"
            maxLength={280}
          ></textarea>

          <div className="char-count">{postText.length}/280</div>

          <div className="color-options">
            <span>🎨 Renk Seç:</span>
            {[
              "#7c3aed","#6d28d9","#8b5cf6","#a78bfa",
              "#ef4444","#dc2626","#f87171","#fecaca",
              "#22c55e","#16a34a","#4ade80","#bbf7d0",
              "#3b82f6","#2563eb","#60a5fa","#bfdbfe",
              "#f59e0b","#d97706","#fbbf24","#fde68a",
              "#14b8a6","#0d9488","#5eead4","#ccfbf1",
              "#9333ea","#e11d48","#0ea5e9","#10b981",
              "#1f2937","#111827","#4b5563","#6b7280",
              "#9ca3af","#d1d5db","#ffffff","#000000"
            ].map((c,i)=>(
              <button key={i} className="color-btn" style={{background:c}} onClick={() => setPostColor(c)}></button>
            ))}
          </div>

          <div className="emoji-options">
            <span>😊 Emoji Ekle:</span>
            {[
              "🌸","🌼","🌺","🌻","🌷","🌹","🍀","🍃","🌿","🌵",
              "☀️","🌤️","⛅","🌥","🌧","⛈","🌈","❄️","🌙","⭐",
              "🔥","💧","🌊","🍂","🍁","🌪","🌫",
              "😊","😎","🥰","😍","🤩","🤭","😇","🤍","🖤","💜",
              "❤️","🧡","💛","💚","💙","💗","💖","💘","💞","💫",
              "☕","🍵","🍔","🍟","🍕","🍝","🍣","🍩","🍪","🍫",
              "🎶","🎧","🎤","🎬","🎮","🎨","📚","🖥","💪","🏃‍♀️"
            ].map((e,i)=>(
              <button key={i} className="emoji-btn" onClick={() => setPostText(postText + e)}>{e}</button>
            ))}
          </div>

          <div className="post-form-actions">
            <button className="btn" onClick={() => setShowPostForm(false)}>İptal ❌</button>
            <button className="btn" onClick={handleShare}>Paylaş 📤</button>
          </div>

        </div>
      )}

      {/* BİLDİRİM MODALI */}
      {showNotifications && (
        <div className="notif-modal">
          <h3>Bildirimler</h3>

          <ul className="notif-list">
            <li>📩 Yeni takip isteği</li>
            <li>💬 Gönderine biri emoji bıraktı</li>
            <li>⭐ Bugün çok aktif görünüyorsun!</li>
          </ul>

          <button className="btn" onClick={() => setShowNotifications(false)}>
            Kapat ❌
          </button>
        </div>
      )}

    </div>
  );
}
