import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import closeIcon from "../../assets/close Icon.svg";
import "./StatusModal.css";

const COLORS = [
  "#C40461",
  "#6A70EC",
  "#8CADE1",
  "#334D77",
  "#387C00",
  "#744CEE",
  "#BFA6A2",
  "#0079FF",
];

export default function StatusModal({
  isOpen,
  isEditing = false,
  initialTitle = "",
  initialColor = "",
  onClose,
  onSave,
}) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [color, setColor] = useState(COLORS[0]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    if (isOpen) {
      setTitle(initialTitle);
      setColor(initialColor || COLORS[0]);
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, initialTitle, initialColor]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSave({ title, color });
    onClose();
  };

  return (
    <div className="status-modal-backdrop">
      <div className="status-modal">
        <img
          src={closeIcon}
          alt="Close"
          onClick={onClose}
          className="close-icon"
        />

        <h3>
          {isEditing
            ? t("statusModel.editTitle")
            : t("statusModel.createTitle")}
        </h3>

        <form onSubmit={handleSave}>
          <label>
            {t("statusModel.titleLabel")}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("statusModel.titlePlaceholder")}
              required
            />
          </label>

          <div className="modal-colors">
            {COLORS.map((c) => (
              <div
                key={c}
                onClick={() => setColor(c)}
                className={`color-swatch ${c === color ? "selected" : ""}`}
                style={{
                  backgroundColor: c,
                  boxShadow: c === color ? `0 0 0 2px ${c}` : "none",
                }}
              />
            ))}
          </div>

          <button type="submit">
            {isEditing
              ? t("statusModel.saveButton")
              : t("statusModel.createButton")}
          </button>
        </form>
      </div>
    </div>
  );
}
