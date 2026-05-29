import React, { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <div className="header">

<div className="logo-area">
  <div className="logo-modern">
    <img src="/assets/fisilti-icon.png" className="logo-modern-icon" />
  </div>
</div>

   
        {open && (
          <div className="menu-dropdown">
            <div className="menu-item">Ana Sayfa</div>
            <div className="menu-item">Profilim</div>
            <div className="menu-item">Ayarlar</div>
            <div className="menu-item">Çıkış Yap</div>
          </div>
        )}
      </div>

          
  );
}
