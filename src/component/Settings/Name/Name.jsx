import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import "./Name.css";
import { UserContext } from "../../../Hooks/UserContext";
const API_URL = import.meta.env.VITE_STARTING_URL;

const Name = () => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    if (sessionStorage.getItem("name")) {
      setName(sessionStorage.getItem("name"));
      return;
    }

    (async () => {
      const res = await axios.get(`${API_URL}/user`, {
        headers: { Authorization: sessionStorage.getItem("token") },
      });
      sessionStorage.setItem("name", res.data.name);
      sessionStorage.setItem("id", res.data.id);
      setName(res.data.name);
    })();
  }, []);
  const handleSave = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await axios.patch(
        `${API_URL}/user/${sessionStorage.getItem("id")}`,
        { name },
        { headers: { Authorization: `${session.getItem("token")}` } }
      );
      setName(res.data.name);
      sessionStorage.setItem("name", res.data.name);
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.error || "Save failed");
    }
  };

  return (
    <div className="name">
      <label htmlFor="name-input">{t("settings.fullName")}</label>
      <input
        id="name-input"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t("settings.namePlaceholder")}
      />
      <div className="save-btn">
        <button className="save" onClick={handleSave}>
          {t("settings.save")}
        </button>
      </div>
      {msg && <p className="message">{msg}</p>}
    </div>
  );
};

export default Name;
