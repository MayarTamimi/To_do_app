import React from "react";
import Header from "../../../UI/Header/Header";
import PersonalInfo from "../PersonalInfo/PersonalInfo";
import Name from "../Name/Name";
import Password from "../Password/Password";
import Status from "../Status/Status";
import { useTranslation } from "react-i18next";
import "./SettingsPage.css";
const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  return (
    <div>
      <Header />
      <div className="main-settings-container">
        <div className="settings-items">
          <button className="back" onClick={() => window.history.back()}>
            &lt;
          </button>
          <h1>{t("settings.title")}</h1>
        </div>
        <PersonalInfo />
        <Name />
        <Password />
        <Status />
      </div>
    </div>
  );
};

export default SettingsPage;
