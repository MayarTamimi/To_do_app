import React from "react";
import close from "../../../../assets/close Icon.svg";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./DeleteStatus.css";
const DeleteStatus = ({onConfirm , onClose}) => {
  const { t } = useTranslation();
  return (
    <div className="create-model-container">
      <div className="delete-modal fade-in">
        <h3>{t("deleteStatus.modalTitle")}</h3>
        <img src={close} alt="" onClick={onClose} style={{ cursor: "pointer" }}/>
      <div className="delete-content">
        <h2>{t('deleteStatus.warningLine1')} </h2>
        <h2>{t('deleteStatus.warningLine2')}</h2>
        <p>
          {t('deleteStatus.warningDetail')}
        </p>
      </div>
      <button onClick={onConfirm}>{t("deleteStatus.confirmButton")}</button>
    </div>
    </div>

  );
};

export default DeleteStatus;
