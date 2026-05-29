import React from "react";

export default function ProfileHeader({
  onPhotoClick,
  onBioClick,
  onEditProfileClick,
  bioText,
  profilePhoto,
  name,
  username
}) {

  // ⭐ Arka plan rengine göre otomatik yazı rengi seçen fonksiyon
  const getTextColor = (bgColor) => {
    if (!bgColor || !bgColor.startsWith("#")) return "#fff";
    const c = bgColor.substring(1);
    const rgb = parseInt(c, 16);
    const r = (rgb >> 16) & 255;
    const g = (rgb >> 8) & 255;
    const b = rgb & 255;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 140 ? "#000" : "#fff";
  };

  return (
    <div className="profile-header">

      {/* SOL BLOK */}
      <div className="profile-left-column">

        <div className="profile-photo-section" onClick={onPhotoClick}>
          {profilePhoto ? (
            <img src={profilePhoto} alt="Profil" className="profile-photo" />
          ) : (
            <div className="photo-placeholder">Fotoğraf +</div>
          )}
        </div>

        <div className="profile-name-under-photo">{name}</div>

        <button className="edit-profile-btn" onClick={onEditProfileClick}>
          Profili Düzenle
        </button>

        <div className="join-date-block">
          Katılma tarihi: 10/03/2026
        </div>

      </div>

      {/* SAĞ BLOK */}
      <div className="profile-right-column">

        <h2 className="profile-username">{username}</h2>

        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-number">30</span>
            <span className="stat-label">Gönderi</span>
          </div>

          <div className="stat-card">
            <span className="stat-number">50</span>
            <span className="stat-label">Takipçi</span>
          </div>

          <div className="stat-card">
            <span className="stat-number">50</span>
            <span className="stat-label">Takip</span>
          </div>
        </div>

        {/* ⭐ BİYOGRAFİ KUTUSU — OTOMATİK YAZI RENGİ ⭐ */}
        <div
          className="bio-box"
          style={{
            backgroundColor: bioText.bgColor,
            color: getTextColor(bioText.bgColor)
          }}
          onClick={onBioClick}
        >
          <div className="bio-title">Biyografi</div>
          <p>{bioText.text || "✨ Biyografinizi eklemek için dokunun"}</p>
        </div>

      </div>
    </div>
  );
}
