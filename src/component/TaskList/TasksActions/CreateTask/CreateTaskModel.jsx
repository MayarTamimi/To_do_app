import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import closeIcon from "../../../../assets/close Icon.svg";
import axios from "axios";
import "./CreateTask.css";

const API_URL = import.meta.env.VITE_STARTING_URL;

const CreateTaskModel = ({
  isOpen,
  closeModal,
  onCreate,
  onUpdate,
  editingTask,
}) => {
  const { t } = useTranslation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      if (editingTask) {
        setTitle(editingTask.title || "");
        setDescription(editingTask.description || "");
        setStatus(editingTask.statusId || "");
      } else {
        setTitle("");
        setDescription("");
        setStatus("");
      }

      const getStatuses = async () => {
        try {
          const token = sessionStorage.getItem("token");
          const response = await axios.get(`${API_URL}/status`, {
            headers: { Authorization: token },
          });
          setStatuses(response.data.status || response.data);
        } catch (err) {
          console.error("Error fetching statuses:", err);
        }
      };

      getStatuses();
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      statusId: status,
    };

    if (editingTask) {
      onUpdate({ ...payload, id: editingTask.id });
    } else {
      onCreate(payload);
    }

    setTitle("");
    setDescription("");
    setStatus("");
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div className="create-model-container">
      <div className="modal">
        <div className="modal-head">
          <h1>{t("createTask.title")}</h1>
          <img src={closeIcon} onClick={closeModal} alt="Close" />
        </div>
        <form className="action" onSubmit={handleSubmit}>
          <div className="labels">
            <label>
              {t("createTask.taskTitle")}
              <input
                type="text"
                className="title"
                value={title}
                placeholder={t("createTask.taskTitle")}
                onChange={(e) => setTitle(e.target.value)}
                onInvalid={(e) =>
                  e.target.setCustomValidity(
                    t("createTask.customRequiredMessage")
                  )
                }
                onInput={(e) => e.target.setCustomValidity("")}
                required
              />
            </label>
            <label>
              {t("createTask.description")}
              <textarea
                value={description}
                placeholder={t("createTask.descriptionPlaceholder")}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
            <label>
              {t("createTask.status")}
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="" disabled>
                  -- {t("createTask.statusPlaceholder")} --
                </option>
                {statuses.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button type="submit">
            {editingTask
              ? t("createTask.updateButton")
              : t("createTask.createButton")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModel;
