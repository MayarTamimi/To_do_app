import React, { useContext, useState, useEffect } from "react";
import logo from "../../assets/logo.svg";
import moon from "../../assets/Frame.svg";
import fullMoon from "../../assets/fullMoon.png";
import lang from "../../assets/Lang.svg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../Hooks/ThemContext";
import outIcon from "../../assets/out.svg";
import whiteLang from "../../assets/whiteLangIcone.png";
import defaultAvatar from "../../assets/user.svg";
import useToggleLang from "../../Hooks/useToggleLang";
import profileIcon from "../../assets/User.svg";

const Header = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFullMoon, setIsFullMoon] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);

  const toggleLang = useToggleLang();

  const handleMoonClick = () => {
    setIsFullMoon((prev) => !prev);
    setDarkMode((prev) => !prev);
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("user_photo");
    sessionStorage.removeItem("current_email");
    window.location.href = "/";
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  useEffect(() => {
    const currentEmail = sessionStorage.getItem("current_email");
    if (currentEmail) {
      const avatarKey = `avatar_${currentEmail}`;
      const photo = sessionStorage.getItem(avatarKey);
      if (photo) {
        setUserPhoto(photo);
        sessionStorage.setItem("user_photo", photo);
      } else {
        setUserPhoto(null);
      }
    }
  }, []);

  return (
    <div className="main-container">
      <header className="header">
        <Link to="/">
          <img className="logo" src={logo} alt="Logo" />
        </Link>
        <div className="auth">
          <img
            src={darkMode ? whiteLang : lang}
            alt="Lang"
            onClick={toggleLang}
            className="lang"
          />
          <img
            src={isFullMoon ? fullMoon : moon}
            alt="Theme"
            onClick={handleMoonClick}
            className="moon-toggle"
          />
          {sessionStorage.getItem("token") ? (
            <div className="profile-wrapper">
              <img
                src={userPhoto || defaultAvatar}
                alt="User profile"
                className="profile-photo"
                onClick={toggleDropdown}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultAvatar;
                }}
              />
              {showDropdown && (
                <div className="profile-dropdown">
                  <Link
                    to="/settings"
                    className="dropdown-item"
                    onClick={closeDropdown}
                  >
                    <img src={profileIcon} alt="" className="dropdown-icon" />
                    {t("header.profile")}
                  </Link>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      handleLogout();
                      closeDropdown();
                    }}
                  >
                    <img src={outIcon} alt="" className="dropdown-icon" />
                    {t("header.logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link className="Login" to="/login">
              {t("header.login")}
            </Link>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
