import React, { useState, useEffect } from "react";
import axios from "axios";
import pencile from "../../../assets/PencilLine.svg";
import trash from "../../../assets/Trash.svg";
import { useTranslation } from "react-i18next";
import StatusModal from "../../../UI/StatusModal/StatusModel";
import "./Status.css";

const API_URL = import.meta.env.VITE_STARTING_URL;

const initialStatuses = [
  { id: "1", title: "To do", color: "#6A70EC" },
  { id: "2", title: "Done", color: "#387C00" },
  { id: "3", title: "In Progress", color: "#0079FF" },
];

export default function Status() {
  const { t } = useTranslation();

  const [statuses, setStatuses] = useState(initialStatuses);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);

  useEffect(() => {
    const getStatuses = async () => {
      try {
        const response = await axios.get(`${API_URL}/status`, {
          headers: { Authorization: sessionStorage.getItem("token") },
        });
        setStatuses(response.data.status);
      } catch (err) {
        console.log("Error fetching statuses:", err);
      }
    };
  
    getStatuses();
  }, []);
  

  const openEdit = (status) => {
    setEditingStatus(status);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingStatus(null);
  };

  const handleSave = async ({ title, color }) => {
    if (!editingStatus) return;

    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.patch(
        `${API_URL}/status/${editingStatus.id}`,
        { title, color },
        { headers: { Authorization: token } }
      );

      const updatedStatus = res.data.status;

      setStatuses((current) =>
        current.map((s) => (s.id === updatedStatus.id ? updatedStatus : s))
      );
      closeModal();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDeleteStatus = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`${API_URL}/status/${id}`, {
        headers: { Authorization: token },
      });
      setStatuses((current) => current.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Failed to delete status:", error);
    }
  };

  const handleAddStatus = async ({ title, color }) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/status`,
        { title, color },
        { headers: { Authorization: token } }
      );
      const newStatus = res.data.status;
      setStatuses((prev) => [...prev, newStatus]);
      setModalOpen(false);
    } catch (error) {
      console.error("Failed to add status:", error);
    }
  };

  return (
    <div className="status-profile">
      <h2>{t("status.title")}</h2>

      <div className="status-colors">
        {statuses.map((s) => (
          <div className="status-text" key={s.id}>
            <div className="contents">
              <div className="color" style={{ backgroundColor: s.color }} />
              <span>{s.title}</span>
            </div>
            <div className="imgs">
              <img src={pencile} alt="Edit" onClick={() => openEdit(s)} />
              <img
                src={trash}
                alt="Delete"
                onClick={() => handleDeleteStatus(s.id)}
              />
            </div>
          </div>
        ))}
      </div>

      <StatusModal
        isOpen={modalOpen}
        isEditing={!!editingStatus}
        initialTitle={editingStatus?.title}
        initialColor={editingStatus?.color}
        onClose={closeModal}
        onSave={editingStatus ? handleSave : handleAddStatus}
      />
    </div>
  );
}
