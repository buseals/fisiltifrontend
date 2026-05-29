// src/pages/Profile.jsx
import { useState } from "react";

import ProfileHeader from "../components/ProfileHeader";
import EditPhotoModal from "../components/EditPhotoModal";
import EditBioModal from "../components/EditBioModal";
import EditProfileModal from "../components/EditProfileModal";
import Sidebar from "../components/Sidebar";

import "../styles/profile.css";

export default function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user") || "null") || {
    name: "",
    username: "@kullanici",
    email: "",
    bio: "",
    bgColor: "#6a00ff"
  };

  const [name, setName] = useState(storedUser.name || "");
  const [username, setUsername] = useState(storedUser.username || "@kullanici");

  const [bioText, setBioText] = useState({
    text: storedUser.bio || "",
    bgColor: storedUser.bgColor || "#6a00ff"
  });

  const [profilePhoto, setProfilePhoto] = useState(storedUser.photo || null);

  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showBioModal, setShowBioModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
          name={name}
          username={username}
          bioText={bioText}
          profilePhoto={profilePhoto}
          onPhotoClick={() => setShowPhotoModal(true)}
          onBioClick={() => setShowBioModal(true)}
          onEditProfileClick={() => setShowEditProfile(true)}
        />
      </div>

      {/* FOTOĞRAF MODALI */}
      {showPhotoModal && (
        <EditPhotoModal
          onClose={() => setShowPhotoModal(false)}
          onSave={(url) => {
            setProfilePhoto(url);

            const updatedUser = {
              ...storedUser,
              photo: url
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));

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

            const updatedUser = {
              ...storedUser,
              bio: newBio,
              bgColor: newColor
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));

            setShowBioModal(false);
          }}
        />
      )}

      {/* PROFİL DÜZENLE MODALI */}
      {showEditProfile && (
        <EditProfileModal
          isOpen={showEditProfile}
          initialData={{
            fullname: name,
            username: username,
            bio: bioText.text,
            bgColor: bioText.bgColor,
            email: storedUser.email
          }}
          onClose={() => setShowEditProfile(false)}
          onSave={(data) => {
            setName(data.name);
            setUsername(data.username);
            setBioText({
              text: data.bio,
              bgColor: data.bgColor
            });

            const updatedUser = {
              ...storedUser,
              name: data.name,
              username: data.username,
              bio: data.bio,
              bgColor: data.bgColor
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));

            setShowEditProfile(false);
          }}
        />
      )}
    </div>
  );
}
