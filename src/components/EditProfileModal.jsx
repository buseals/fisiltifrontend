import React, { useState } from "react";

export default function EditProfileModal({ isOpen, onClose, onSave, initialData }) {
  const [fullname, setFullname] = useState(initialData.fullname);
  const [username, setUsername] = useState(initialData.username);
  const [bio, setBio] = useState(initialData.bio);
  const [bgColor, setBgColor] = useState(initialData.bgColor);

  const colors = [
    "#6a00ff","#ff007f","#00c2ff","#00ff9d","#ffd500",
    "#ff6b00","#ff0000","#ff4dd2","#4dffea","#b84dff",
    "#4d79ff","#33ff57","#ff3333","#ffaa00","#0099ff"
  ];

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="editprofile-modal">

        <h2 className="editprofile-title">Profili Düzenle</h2>

        <div className="editprofile-block">

          <label className="editprofile-label">Ad</label>
          <input
            className="editprofile-input"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />

          <label className="editprofile-label">Kullanıcı Adı</label>
          <input
            className="editprofile-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label className="editprofile-label">Biyografi</label>
          <textarea
            className="editprofile-textarea"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Biyografinizi yazın..."
          />

          <label className="editprofile-label">Biyografi Rengi</label>
          <div className="editprofile-color-grid">
            {colors.map((color, index) => (
              <div
                key={index}
                className="editprofile-color"
                style={{
                  backgroundColor: color,
                  border: bgColor === color
                    ? "3px solid white"
                    : "2px solid rgba(255,255,255,0.3)"
                }}
                onClick={() => setBgColor(color)}
              ></div>
            ))}
          </div>

        </div>

        <div className="editprofile-buttons">
          <button className="editprofile-cancel" onClick={onClose}>İptal</button>

          {/* ⭐ TÜM VERİLERİ GERİ GÖNDEREN KAYDET ⭐ */}
          <button
            className="editprofile-save"
            onClick={() =>
              onSave({
                fullname,
                username,
                bio,
                bgColor
              })
            }
          >
            Kaydet
          </button>
        </div>

      </div>
    </div>
  );
}
