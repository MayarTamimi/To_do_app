import React from "react";
import bg from "../../../assets/red-bg.svg";
import ghosts from "../../../assets/ghosts.svg";
import { withTranslation } from "react-i18next";
import arrow from "../../../assets/row.svg";
import { Link } from "react-router-dom";
import "./Ghosts.css";
class Ghosts extends React.Component {

  render () {
    const {t} = this.props
  return (
    <div className="container">
      <div className="arrow-text">{t("ghosts.subTitle")}</div>
      <img className="arrow" src={arrow} alt="" />
      <img src={bg} alt="background" className="bg" />
      <div className="img-content">
        <p>{t("ghosts.content")}</p>
        <img src={ghosts} alt="ghosts" className="ghosts" />
        <Link to="/hunt">
          <button className="hunt">{t("ghosts.button")}</button>
        </Link>
      </div>
    </div>
  );
};
}
export default withTranslation()( Ghosts);
