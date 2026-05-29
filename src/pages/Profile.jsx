// src/pages/Profile.jsx
import { useState } from "react";

import ProfileHeader from "../components/ProfileHeader";
import EditPhotoModal from "../components/EditPhotoModal";
import EditBioModal from "../components/EditBioModal";
import EditProfileModal from "../components/EditProfileModal";
import Sidebar from "../components/Sidebar";

import "../styles/profile.css";

export default function Profile() {
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showBioModal, setShowBioModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [profilePhoto, setProfilePhoto] = useState(null);

  const [bioText, setBioText] = useState({
    text: "",
    bgColor: "#6a00ff"
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="profile-page">

      {/* SOL ÜST LOGO */}
      <div className="app-logo">
        <img src="/assets/fisilti-icon.png" alt="logo" />
      </div>

      {/* SAĞ ÜST MENÜ */}
      <div className="top-menu">
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          ☰ Menü
        </button>

        {menuOpen && (
          <div className="menu-dropdown">
            <Sidebar onLogout={handleLogout} />
          </div>
        )}
      </div>

      {/* PROFİL HEADER */}
      <div className="profile-block">
        <ProfileHeader
          onPhotoClick={() => setShowPhotoModal(true)}
          onBioClick={() => setShowBioModal(true)}
          onEditProfileClick={() => setShowEditProfile(true)}
          bioText={bioText}
          profilePhoto={profilePhoto}
        />
      </div>

      {/* FOTOĞRAF MODALI */}
      {showPhotoModal && (
        <EditPhotoModal
          onClose={() => setShowPhotoModal(false)}
          onSave={(url) => {
            setProfilePhoto(url);
            setShowPhotoModal(false);
          }}
        />
      )}

      {/* BİYOGRAFİ MODALI */}
      {showBioModal && (
        <EditBioModal
          isOpen={showBioModal}
          initialBio={bioText.text}
          initialColor={bioText.bgColor}
          onClose={() => setShowBioModal(false)}
          onSave={(newBio, newColor) => {
            setBioText({
              text: newBio,
              bgColor: newColor
            });
            setShowBioModal(false);
          }}
        />
      )}

      {/* PROFİL DÜZENLE MODALI */}
      {showEditProfile && (
        <EditProfileModal
          isOpen={showEditProfile}
          initialData={{
            username: "@buse",
            fullname: "Buse",
            bio: bioText.text,
            bgColor: bioText.bgColor
          }}
          onClose={() => setShowEditProfile(false)}
          onSave={(data) => {
            setBioText({
              text: data.bio,
              bgColor: data.bgColor
            });
            setShowEditProfile(false);
          }}
        />
      )}
    </div>
  );
}
