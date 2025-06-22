import React from "react";
import panda from "../../../assets/panda.svg";
import { withTranslation } from "react-i18next";
import "./Ghost.css";
class Panda extends React.Component {

  render(){
    const {t , i18n} = this.props;
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
}
};

export default withTranslation()(Panda);
