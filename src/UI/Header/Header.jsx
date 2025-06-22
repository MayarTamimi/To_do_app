import React, { useContext, useState, useEffect } from "react";
import logo from "../../assets/logo.svg";
import moon from "../../assets/Frame.svg";
import fullMoon from "../../assets/fullMoon.png";
import lang from "../../assets/Lang.svg";
import { Link } from "react-router-dom";
import { useTranslation, withTranslation } from "react-i18next";
import { ThemeContext } from "../../Hooks/ThemContext";
import outIcon from "../../assets/out.svg";
import whiteLang from "../../assets/whiteLangIcone.png";
import defaultAvatar from "../../assets/user.svg";
import useToggleLang from "../../Hooks/useToggleLang";
import profileIcon from "../../assets/User.svg";

class Header extends React.Component {


  constructor(props) {
    super(props)
    this.state = {
      showDropdown : false,
      isFullMoon : false,
      navigateHome : false,
      userPhoto : null
    }
  }

  static contextType = ThemeContext
  
  componentDidMount () {
    const currentEmail = sessionStorage.getItem("current_email");
    if(currentEmail) {
      const avatarKey = `avatar_${currentEmail}`;
      const photo = sessionStorage.getItem(avatarKey);
      if (photo) {
        setUserPhoto(photo);
        sessionStorage.setItem("user_photo", photo);
      } else {
        setUserPhoto(null);
      }
    }
  }

  toggleLang = () => {
  const currentLang = localStorage.getItem("i18nextLng");
  const newLang = currentLang === "ar" ? "en" : "ar";
  localStorage.setItem("i18nextLng", newLang);
  window.location.reload();
}


  handleMoonClick = () => {
    const { setDarkMode } = this.context;
    this.setState((prev) => ({ isFullMoon: !prev.isFullMoon }), () => setDarkMode((prev) => !prev));
  }

  handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    this.setState({ navigateHome: true });
  }

  toggleDropdown = () => {
    this.setState((prev) => ({
      showDropdown: !prev.showDropdown,
    }));
  }

  closeDropdown = () => {
    this.setState({ showDropdown: false });
  }

  render () {
    const {t} = this.props

  const { isFullMoon, showDropdown, navigateHome } = this.state;
  const { darkMode } = this.context;
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
            onClick={this.toggleLang}
            className="lang"
          />
          <img
            src={isFullMoon ? fullMoon : moon}
            alt="Theme"
            onClick={this.handleMoonClick}
            className="moon-toggle"
          />
          {sessionStorage.getItem("token") ? (
            <div className="profile-wrapper">
              <img
                src={userPhoto || defaultAvatar}
                alt="User profile"
                className="profile-photo"
                onClick={this.toggleDropdown}
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
                    onClick={this.closeDropdown}
                  >
                    <img src={profileIcon} alt="" className="dropdown-icon" />
                    {t("header.profile")}
                  </Link>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      this.handleLogout();
                      this.closeDropdown();
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
}

export default withTranslation() (Header);
