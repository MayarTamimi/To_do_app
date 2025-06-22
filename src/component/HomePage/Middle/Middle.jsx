import React from "react";
import { useTranslation, withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import todo from "../../../assets/todo-text.png";
import i18n from "../../../i18n";
import "./Middle.css";
class Middle extends React.Component {

  render (){
  const { t, i18n } = this.props;
  const isLeft = i18n.language === "en";
  return (
    <div className="middle-container">
      <h1>
        {t("middle.title")}
        {isLeft && (
          <img
            src={todo}
            alt=""
            style={{
              display: "inline",
              verticalAlign: "middle",
              width: "120px",
              height: "120px",
            }}
          />
        )}
        {isLeft && t("middle.title2")}
      </h1>

      <p>{t("middle.description")}</p>
      <Link to="/tasks">
        <button className="get-started">{t("middle.button")}</button>
      </Link>
    </div>
  );
};
}

export default withTranslation()(Middle); 
