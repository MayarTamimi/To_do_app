import React from "react";
import panda from "../../../assets/panda.svg";
import { useTranslation } from "react-i18next";
import "./Ghost.css";
const Panda = () => {
    const { t, i18n } = useTranslation();
  return (
    <div className="panda">
      <div className="text">
        <p className="red-title">{t("panda.redTitle")}</p>
        <h1>{t("panda.mainTitle")}</h1>
        <p>
          {t("panda.description")}
        </p>
      </div>
      <img src={panda} alt="" />
    </div>
  );
};

export default Panda;
