import React, { useState } from "react";

export default function EditPhotoModal({ onClose, onSave }) {
  const [preview, setPreview] = useState(null);
  const [fileData, setFileData] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileData(file);

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  const handleSave = () => {
    if (!fileData) return;
    const imageUrl = URL.createObjectURL(fileData);
    onSave(imageUrl);
  };

  return (
    <div className="modal-overlay">
      <div className="photo-modal">

        <h3 className="photo-title">Fotoğraf Seç</h3>

        {/* FOTOĞRAF ÖNİZLEME */}
        {preview ? (
          <img src={preview} alt="preview" className="photo-preview" />
        ) : (
          <div className="photo-upload-box">
            <div className="upload-icon">📁</div>
            <p className="upload-text">Henüz fotoğraf seçilmedi</p>

            <label className="upload-btn">
              Dosya Seç
              <input type="file" accept="image/*" onChange={handleFileSelect} />
            </label>
          </div>
        )}

        {/* BUTONLAR */}
        <div className="photo-buttons">
          <button className="photo-cancel" onClick={onClose}>İptal</button>
          <button className="photo-save" onClick={handleSave}>Kaydet</button>
        </div>

      </div>
    </div>
  );
}
