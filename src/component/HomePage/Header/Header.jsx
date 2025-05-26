import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.svg";
import langIcon from "../../../assets/Lang.svg";
import moonIcon from "../../../assets/Frame.svg";
import fullMoon from "../../../assets/fullMoon.png";
import whiteLang from "../../../assets/whiteLangIcone.png";
import outIcon from "../../../assets/out.svg";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../../Hooks/ThemContext";
import "./Header.css";
import defaultAvatar from "../../../assets/user.svg";
import useToggleLang from "../../../Hooks/useToggleLang";
import user from "../../../assets/user.svg";

const Header = () => {
  const { t } = useTranslation();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [isFullMoon, setIsFullMoon] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const toggleLang = useToggleLang();

  const handleMoonClick = () => {
    setIsFullMoon((prev) => !prev);
    setDarkMode((prev) => !prev);
  };

  const handleLogout = () => {
    console.log("logout");
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  const userPhoto = sessionStorage.getItem("user_photo");

  return (
    <header className="header">
      <img className="logo" src={logo} alt="Logo" />
      <nav className="links">
        <Link to="/" className="home-header">
          {t("header.home")}
        </Link>
        <Link to="/hunt" className="hunt-header">
          {t("header.huntGhost")}
        </Link>
      </nav>
      <div className="auth">
        <img
          src={darkMode ? whiteLang : langIcon}
          alt="Language toggle"
          onClick={toggleLang}
          className="lang"
          // removed inline cursor style here
        />
        <img
          src={isFullMoon ? fullMoon : moonIcon}
          alt="Theme toggle"
          onClick={handleMoonClick}
          className="moon-toggle"
          // removed inline cursor style here
        />
        {sessionStorage.getItem("token") ? (
          <div className="profile-wrapper">
            <img
              src={userPhoto || defaultAvatar}
              alt="User profile"
              className="profile-photo"
              onClick={toggleDropdown}
              // removed inline cursor style here
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
                  <img src={user} alt="" className="dropdown-icon" />
                  {t("header.profile")}
                </Link>
                <button
                  className="dropdown-item logout-button"
                  onClick={() => {
                    handleLogout();
                    closeDropdown();
                  }}
                >
                  <img
                    src={outIcon}
                    alt="Logout icon"
                    className="dropdown-icon"
                  />
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
  );
};

export default Header;
