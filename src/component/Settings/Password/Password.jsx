import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import eyeIcon from "../../../assets/eye.svg";
import "./Password.css";
import { usePasswordValidation } from "../../../Hooks/UseValidationPassword";
import axios from "axios";

const API_URL = import.meta.env.VITE_STARTING_URL
const Password = () => {
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [visibleOld, setVisibleOld] = useState(false);
  const [visibleNew, setVisibleNew] = useState(false);
  const [msg, setMsg] = useState("");
  const { isValid, error } = usePasswordValidation({ newPassword });

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      console.log("trd")

      const response = await axios.patch(
        `${API_URL}/user/${sessionStorage.getItem("id")}`,
        { password: newPassword },
        { headers: { Authorization: localStorage.getItem("token") } }
      )
      setMsg(response.data.message);

    }catch (err) {
      setMsg(err.response?.data?.error || "Save failed");
    }
  };

  return (
    <div className="password">
      <h2>{t("password.title")}</h2>

      <div className="password-container">
        <label>
          {t("password.old")}
          <div className="password-field">
            <input
              type={visibleOld ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder={t("password.oldPlaceholder")}
            />
            <img
              src={eyeIcon}
              alt="toggle"
              className="eye-icon"
              onClick={() => setVisibleOld((v) => !v)}
            />
          </div>
        </label>

        <label>
          {t("password.new")}
          <div className="password-field">
            <input
              type={visibleNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t("password.newPlaceholder")}
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              required
            />
            <img
              src={eyeIcon}
              alt="toggle"
              className="eye-icon"
              onClick={() => setVisibleNew((v) => !v)}
            />
          </div>
        </label>
      </div>
      <div className="save-btn">
      <button
        className="save"
        onClick={handleSave}
      >
        {t("password.save")}
      </button>
      </div>
      {msg && <p className="message">{msg}</p>}
    </div>
  );
};

export default Password;
