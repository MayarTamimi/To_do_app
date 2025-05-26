import React from "react";
import { useTranslation } from "react-i18next";
import "./MiddleBar.css";
const MiddleBar = () => {
  const { t, i18n } = useTranslation();
  return (
    <div className="middle-bar">
    <br /><br /><br /><br /><br /><br /><br /><br /><br />
      <div className="bar">
        <div className="bar-2">
        <div className="card border  active">{t("middleBar.card1")}</div>
        <div className="card active">{t("middleBar.card2")}</div>
        </div>
        <div className="card">{t("middleBar.card3")}</div>
      </div>
    </div>
  );
};

export default MiddleBar;
