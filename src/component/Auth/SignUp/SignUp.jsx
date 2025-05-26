import React, { useState, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../../Hooks/ThemContext";
import signin from "../../../assets/sign-in.svg";
import langIcon from "../../../assets/Lang.svg";
import moonIcon from "../../../assets/Frame.svg";
import logo from "../../../assets/footer-logo-auth.svg";
import uploadBtn from "../../../assets/upload-btn.svg";
import defaultAvatar from "../../../assets/user.svg";
import "./SignUp.css";
import { usePasswordValidation } from "../../../Hooks/UseValidationPassword";
import { UserContext } from "../../../Hooks/UserContext";
import useToggleLang from "../../../Hooks/useToggleLang";
import axios from "axios";

const API_URL = import.meta.env.VITE_STARTING_URL;

const SignUp = () => {
  const { t } = useTranslation();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({ email: "", password: "", user: {} });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [msg, setMsg] = useState("");
  const { isValid, error } = usePasswordValidation({ password: form.password });

  const toggleLang = useToggleLang();

  const handleClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setAvatarPreview(null);
  };

  const handleChange = (e) => {
    if (e.target.name === "user") {
      setForm((f) => ({ ...f, user: { ...f.user, name: e.target.value } }));
    } else {
      setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await axios.post(`${API_URL}/auth/register`, form);
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("current_email", res.data.user.email);

      if (avatarPreview) {
        sessionStorage.setItem(`avatar_${res.data.user.email}`, avatarPreview);
      }

      setUser({ id: res.data.user.id, name: res.data.user.name });
      window.location.href = "/";
    } catch (err) {
      setMsg(err.response?.data?.error || "Error occurred");
    }
  };

  return (
    <>
      <header className="signup-header">
        <img
          src={langIcon}
          alt="toggle language"
          onClick={toggleLang}
          style={{ cursor: "pointer" }}
        />
        <img
          src={moonIcon}
          alt="theme toggle"
          onClick={() => setDarkMode(!darkMode)}
          style={{ cursor: "pointer" }}
        />
      </header>

      <div className="signup-container" dir={t("direction")}>
        <div className="signup-left">
          <img src={signin} alt="Sign in illustration" />
        </div>
        <div className="signup-right">
          <h2>{t("signup.title")}</h2>
          <h4>{t("signup.subtitle")}</h4>

          <form onSubmit={handleSubmit}>
            <div className="upload-section">
              <img
                className="upload-btn"
                src={uploadBtn}
                alt={t("signup.upload")}
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
              <img
                src={avatarPreview || defaultAvatar}
                alt="Avatar"
                className="avatar-preview"
              />
              {avatarPreview && (
                <button
                  type="button"
                  className="remove-avatar-btn"
                  onClick={handleRemove}
                >
                  {t("signup.remove")}
                </button>
              )}
            </div>

            <label>{t("signup.name")}</label>
            <input
              name="user"
              type="text"
              value={form.user.name || ""}
              onChange={handleChange}
              placeholder={t("signup.name")}
              required
            />

            <label>{t("signup.email")}</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder={t("signup.email")}
              required
            />

            <label>{t("signup.password")}</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder={t("signup.password")}
              required
            />

            <button type="submit">{t("signup.button")}</button>
          </form>

          {msg && <p className="message">{msg}</p>}

          <div className="link">
            {t("signup.haveAccount")}{" "}
            <Link to="/login">{t("signup.logIn")}</Link>
          </div>

          <div className="footer">
            <img className="footer-logo" src={logo} alt="logo" />
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
