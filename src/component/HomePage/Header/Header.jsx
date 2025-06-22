import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";
import logo from "../../../assets/logo.svg";
import langIcon from "../../../assets/Lang.svg";
import moonIcon from "../../../assets/Frame.svg";
import fullMoon from "../../../assets/fullMoon.png";
import whiteLang from "../../../assets/whiteLangIcone.png";
import outIcon from "../../../assets/out.svg";
import { withTranslation } from "react-i18next";
import { ThemeContext } from "../../../Hooks/ThemContext";
import "./Header.css";
import defaultAvatar from "../../../assets/user.svg";
import user from "../../../assets/user.svg";

class Header extends Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);
    this.state = {
      isFullMoon: false,
      showDropdown: false,
      navigateHome: false,
    };
  }

  handleMoonClick = () => {
    const { setDarkMode } = this.context;
    this.setState(
      (prevState) => ({ isFullMoon: !prevState.isFullMoon }),
      () => setDarkMode((prev) => !prev)
    );
  };

  handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    this.setState({ navigateHome: true });
  };

  toggleDropdown = () => {
    this.setState((prevState) => ({
      showDropdown: !prevState.showDropdown,
    }));
  };

  closeDropdown = () => {
    this.setState({ showDropdown: false });
  };

  toggleLang = () => {
    const { i18n } = this.props;
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
  };

  render() {
    const { isFullMoon, showDropdown, navigateHome } = this.state;
    const { t } = this.props;
    const { darkMode } = this.context;
    const userPhoto = sessionStorage.getItem("user_photo");

    if (navigateHome) return <Navigate to="/" />;

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
            onClick={this.toggleLang}
            className="lang"
          />
          <img
            src={isFullMoon ? fullMoon : moonIcon}
            alt="Theme toggle"
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
                    <img src={user} alt="" className="dropdown-icon" />
                    {t("header.profile")}
                  </Link>
                  <button
                    className="dropdown-item logout-button"
                    onClick={() => {
                      this.handleLogout();
                      this.closeDropdown();
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
  }
}

export default withTranslation()(Header);
