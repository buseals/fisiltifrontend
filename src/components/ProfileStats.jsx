import React from "react";

export default function ProfileStats() {
  return (
    <div className="stats-row">
      <div className="stat-box">
        <div className="stat-number">30</div>
        <div className="stat-label">Gönderi</div>
      </div>

      <div className="stat-box">
        <div className="stat-number">50</div>
        <div className="stat-label">Takipçi</div>
      </div>

      <div className="stat-box">
        <div className="stat-number">50</div>
        <div className="stat-label">Takip</div>
      </div>
    </div>
  );
}
