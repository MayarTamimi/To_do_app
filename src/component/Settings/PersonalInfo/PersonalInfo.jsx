import React, { useRef, useState, useEffect } from "react";
import uploader from "../../../assets/upload-btn.svg";
import { useTranslation } from "react-i18next";
import "./PersonalInfo.css";

const PersonalInfo = () => {
  const fileInputRef = useRef(null);
  const { t } = useTranslation();
  const [avatar, setAvatar] = useState(null);

  const currentEmail = sessionStorage.getItem("current_email");

  useEffect(() => {
    const savedAvatar = sessionStorage.getItem(`avatar_${currentEmail}`);
    if (savedAvatar) {
      setAvatar(savedAvatar);
    } else {
      console.warn("No saved avatar found for user:", currentEmail);
    }
  }, [currentEmail]);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      sessionStorage.setItem(`avatar_${currentEmail}`, base64String);
      setAvatar(base64String);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="personal-info">
      <h2>{t("settings.personalInfo")}</h2>
      <div className="img-uploader">
        {avatar ? (
          <img className="user-img" src={avatar} alt="user-profile-img" />
        ) : (
          <>
            <img
              className="user-img"
              src={uploader} 
              alt="default-user-profile"
            />
            {console.warn("Avatar not displayed because no image is set.")}
          </>
        )}

        <div className="upload">
          <img
            src={uploader}
            alt="upload"
            onClick={handleClick}
            style={{ cursor: "pointer" }}
          />
          <input
            type="file"
            style={{ display: "none" }}
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
