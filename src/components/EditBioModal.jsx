import React, { useState } from "react";

export default function EditBioModal({ isOpen, onClose, onSave, initialBio, initialColor }) {
  const [bio, setBio] = useState(initialBio || "");
  const [selectedColor, setSelectedColor] = useState(initialColor || "#6a00ff");

  // OTOMATİK KONTRAST HESABI
  const getContrastColor = (hex) => {
    const c = hex.replace("#", "");
    const r = parseInt(c.substr(0, 2), 16);
    const g = parseInt(c.substr(2, 2), 16);
    const b = parseInt(c.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 140 ? "#000" : "#fff";
  };

  // TAM EMOJİ SETİ
  const emojis = [
    "✨","💜","🌙","🔥","⭐","💫","🌸","🎀","🦋","💎",
    "❤️","💖","💗","💞","💕","💘","💟","🌈","☀️","🌤️",
    "🌺","🌻","🌼","🌷","🌹","🍀","🍃","🌿","🌵","😎",
    "😊","🥰","🤍","🖤","💛","💚","💙","💜","🤎"
  ];

  // RENK PALETİ
  const colors = [
    "#6a00ff","#ff007f","#00c2ff","#00ff9d","#ffd500",
    "#ff6b00","#ff0000","#ff4dd2","#4dffea","#b84dff",
    "#4d79ff","#33ff57","#ff3333","#ffaa00","#0099ff"
  ];

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="bio-edit-modal">

        <h3 className="bio-edit-title">Biyografiyi Düzenle</h3>

        <div className="bio-edit-block">

          {/* EMOJİLER */}
          <div className="bio-emoji-grid">
            {emojis.map((emoji, index) => (
              <span
                key={index}
                className="bio-emoji"
                onClick={() => setBio(bio + emoji)}
              >
                {emoji}
              </span>
            ))}
          </div>

          {/* RENKLER */}
          <div className="bio-color-grid">
            {colors.map((color, index) => (
              <div
                key={index}
                className="bio-color"
                style={{
                  backgroundColor: color,
                  border: selectedColor === color
                    ? "3px solid white"
                    : "2px solid rgba(255,255,255,0.3)",
                }}
                onClick={() => setSelectedColor(color)}
              ></div>
            ))}
          </div>

          {/* TEXTAREA — RENK + KONTRAST + GLOW */}
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="bio-edit-textarea"
            style={{
              backgroundColor: selectedColor + "33",
              borderColor: selectedColor,
              color: getContrastColor(selectedColor),
              boxShadow: `0 0 18px ${selectedColor}55`
            }}
            placeholder="Biyografinizi yazın..."
          />

        </div>

        <div className="bio-edit-buttons">
          <button className="bio-cancel" onClick={onClose}>İptal</button>
          <button
            className="bio-save"
            onClick={() => onSave(bio, selectedColor)}
          >
            Kaydet
          </button>
        </div>

      </div>
    </div>
  );
}
