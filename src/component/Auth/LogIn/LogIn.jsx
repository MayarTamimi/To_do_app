import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import signin from "../../../assets/sign-in.svg";
import lang from "../../../assets/Lang.svg";
import moon from "../../../assets/Frame.svg";
import { useState } from "react";
import { UserContext } from "../../../Hooks/UserContext";
import { useContext } from "react";
import "./LogIn.css";
import axios from "axios";
import useToggleLang from "../../../Hooks/useToggleLang"
const URL = import.meta.env.VITE_STARTING_URL;
const LogIn = () => {
  const { t, i18n } = useTranslation();
  const { setAuthenticated, setProfilePhoto } = useContext(UserContext);
  const toggleLang = useToggleLang();

  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = async (type, e) => {
    setForm((f) => ({ ...form, [type]: e.target.value }));
  };

  const handleSubmition = async (e) => {
    e.preventDefault();
    setMsg("");
    const res = axios
      .post(`${URL}/auth/login`, form)
      .then((res) => {
        const token = sessionStorage.setItem("token", res.data.token);
        setAuthenticated(true);
        window.location.href = "/";
      })
      .catch((err) => {
        setMsg(err.response.data.message);
      });
  };

  return (
    <>
      <header className="signup-header">
        <img
          src={lang}
          alt="toggle language"
          style={{ cursor: "pointer" }}
          onClick={toggleLang}
        />
        <img src={moon} alt="theme toggle" />
      </header>
      <div className="login-container" dir={t("direction")}>
        <div className="left">
          <img src={signin} alt="" />
        </div>
        <div className="right">
          <div className="content">{t("login.title")}</div>
          <h4>{t("login.subtitle")}</h4>
          <form onSubmit={handleSubmition}>
            <label>
              {t("login.email")}
              <input
                type="text"
                placeholder={t("login.email")}
                value={form.email}
                onChange={(e) => handleChange("email", e)}
                required
              />
              {t("login.password")}
              <input
                type="password"
                placeholder={t("login.password")}
                value={form.password}
                onChange={(e) => handleChange("password", e)}
                required
              />
            </label>
            <button>{t("login.button")}</button>
          </form>
          {msg && <p className="error">{msg}</p>}
          <div className="link">
            {t("login.noAccount")} <Link to="/signup">{t("login.signUp")}</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogIn;
