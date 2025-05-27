import React, { useState, useEffect } from "react";
import Header from "../../../UI/Header/Header";
import gridIcon from "../../../assets/grid.svg";
import tableIcon from "../../../assets/table.svg";
import CreateTaskModel from "../TasksActions/CreateTask/CreateTaskModel";
import StatusModal from "../../../UI/StatusModal/StatusModel";
import starIcon from "../../../assets/star.svg";
import fullStarIcon from "../../../assets/fillStar.svg";
import addstatus from "../../../assets/addstatuse.svg";
import {
  openDB,
  addTaskToIndexedDB as saveTasks,
  getAllTasks,
} from "../../../Utils/indexedDB";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./TaskGrid.css";

const API_URL = import.meta.env.VITE_STARTING_URL;

function lightenColor(color, amount) {
  let usePound = false;
  if (color[0] === "#") {
    color = color.slice(1);
    usePound = true;
  }
  let num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.min(255, Math.floor(r + (255 - r) * amount));
  g = Math.min(255, Math.floor(g + (255 - g) * amount));
  b = Math.min(255, Math.floor(b + (255 - b) * amount));
  return (
    (usePound ? "#" : "") +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  );
}

const TaskGridPage = () => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [starred, setStarred] = useState({});
  const [statuses, setStatuses] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);

  useEffect(() => {
    openDB(async () => {
      try {
        const token = sessionStorage.getItem("token");
        const taskRes = await axios.post(
          `${API_URL}/task`,
          {},
          { headers: { Authorization: token } }
        );
        const fetchedTasks = (taskRes.data.tasks || taskRes.data).map(
          (task) => ({
            ...task,
            statusId: task.status?.id || "",
          })
        );
        setTasks(fetchedTasks);
        saveTasks(fetchedTasks);
      } catch {
        getAllTasks(setTasks);
      }
    });
    (async () => {
      try {
        const token = sessionStorage.getItem("token");
        const statusRes = await axios.get(`${API_URL}/status`, {
          headers: { Authorization: token },
        });
        setStatuses(statusRes.data.status || statusRes.data);
      } catch {}
    })();
  }, []);

  const openCreateModal = () => setOpenCreate(true);
  const closeCreateModal = () => setOpenCreate(false);
  const toggleStar = (id) =>
    setStarred((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleCreateTask = async (data) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/task`,
        {
          title: data.title,
          description: data.description,
          statusId: data.statusId,
        },
        { headers: { Authorization: token } }
      );
      const newTask = res.data.task || res.data;
      setTasks((prev) => [
        ...prev,
        { ...newTask, statusId: newTask.status?.id || "" },
      ]);
      saveTasks([...tasks, newTask]);
    } catch {
      const id = `task-${Date.now()}`;
      const localTask = {
        id,
        title: data.title,
        description: data.description,
        statusId: data.statusId,
      };
      setTasks((prev) => [...prev, localTask]);
      saveTasks([...tasks, localTask]);
    }
    closeCreateModal();
  };

  const tasksByStatus = statuses.reduce((acc, status) => {
    acc[status.id] = tasks.filter((t) => t.statusId === status.id);
    return acc;
  }, {});

  return (
    <>
      <Header />
      <div className="tabs-container">
        <div className="tabs">
          <Link to="/table">
            <div className="table-tab">
              <img src={tableIcon} alt="Table View" />
              <p>{t("tabs.table")}</p>
            </div>
          </Link>
          <Link to="/grid">
            <div className="grid-tab active">
              <img src={gridIcon} alt="Grid View" />
              <p>{t("tabs.grid")}</p>
            </div>
          </Link>
        </div>
        <div className="create">
          <button onClick={openCreateModal}>{t("tasksActions.create")}</button>
        </div>
      </div>

      <CreateTaskModel
        isOpen={openCreate}
        closeModal={closeCreateModal}
        onCreate={handleCreateTask}
      />
      <StatusModal
        isOpen={openStatusModal}
        onClose={() => setOpenStatusModal(false)}
        onSave={({ title, color }) => {
          axios
            .post(
              `${API_URL}/status`,
              { title, color },
              { headers: { Authorization: sessionStorage.getItem("token") } }
            )
            .then((res) => {
              const newStatus = res.data.status || res.data;
              setStatuses((prev) => [...prev, newStatus]);
            });
          setOpenStatusModal(false);
        }}
      />

      <div className="task-grid">
        <div
          className="cards-grid-columns"
          style={{ display: "flex", gap: "16px" }}
        >
          {statuses.map((status) => {
            const statusTasks = tasksByStatus[status.id] || [];
            return (
              <div key={status.id} className="column">
                <h2>
                  {t(status.title)} ({statusTasks.length})
                </h2>
                <div className="column-tasks">
                  {statusTasks.map((task) => {
                    const isStar = !!starred[task.id];
                    return (
                      <div key={task.id} className="task-card">
                        <button
                          className="status-btn"
                          disabled
                          style={{
                            backgroundColor: lightenColor(
                              status.color || "#fbe6ea",
                              0.85
                            ),
                            color: "#333",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontWeight: "600",
                            cursor: "default",
                            userSelect: "none",
                          }}
                        >
                          {t(status.title)}
                        </button>
                        <div className="task-title">
                          <img
                            src={isStar ? fullStarIcon : starIcon}
                            alt={
                              isStar ? t("tasks.starOff") : t("tasks.starOn")
                            }
                            onClick={() => toggleStar(task.id)}
                            className="tasks-table__star"
                          />
                          <strong>{task.title}</strong>
                        </div>
                        <p>{task.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="column create-status-column">
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <h2>{t("createTask.createStatus")}</h2>
            <img
              className="create-status-img"
              src={addstatus}
              onClick={() => setOpenStatusModal(true)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskGridPage;
