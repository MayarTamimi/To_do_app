import React from "react";
import empty from "../../../assets/Group.svg";
import { withTranslation } from "react-i18next";
import "./EmptyTask.css";
class EmptyTasks extends React.Component {

  render () {
    const { t } = this.props;
    const openModal = () => {
      this.props.openModal();
    };

  return (
    <div className="main-img">
      <img src={empty} alt="" />
      <div className="empty-content">
        <div className="empty-text">
          <h1>({t("emptyTasks.title")})</h1>
          <p> {t("emptyTasks.line1")}</p>
          <p>{t("emptyTasks.line2")}</p>
        </div>
        <button onClick={openModal}>{t("emptyTasks.button")}</button>
      </div>
    </div>
  );
}
};

export default withTranslation()(EmptyTasks);