import React from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import change from '../../../../assets/change.svg';
import edit   from '../../../../assets/edit.svg';
import trash  from '../../../../assets/trash2.svg';
import './TaskSettings.css';
const TaskSettingsMenu = ({ position, onChangeTo, onEdit, onDelete }) => {
  const { t } = useTranslation();

  const menu = (
    <div
      className="task-settings-menu"
      style={{
        position: "absolute",
        top:  position.top,
        left: position.left,
      }}
    >
      <div className="task-actions" onClick={onChangeTo}>
        <img src={change} alt="" />
        <p>{t("taskSettings.changeTo")}</p>
      </div>
      <div className="task-actions" onClick={onEdit}>
        <img src={edit} alt="" />
        <p>{t("taskSettings.edit")}</p>
      </div>
      <div className="task-actions" onClick={onDelete}>
        <img src={trash} alt="" />
        <p>{t("taskSettings.delete")}</p>
      </div>
    </div>
  );

  return ReactDOM.createPortal(menu, document.body);
};

export default TaskSettingsMenu;
