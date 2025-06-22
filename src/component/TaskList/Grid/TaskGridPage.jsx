import React, { Component } from "react";
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
import { withTranslation } from "react-i18next";
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

class TaskGridPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      starred: {},
      statuses: [],
      openCreate: false,
      openStatusModal: false,
    };
  }

  componentDidMount() {
    openDB(() => {
      const fetchTasks = async () => {
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
          this.setState({ tasks: fetchedTasks });
          saveTasks(fetchedTasks);
        } catch {
          getAllTasks((tasks) => this.setState({ tasks }));
        }
      };
      fetchTasks();
    });

    const fetchStatuses = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const statusRes = await axios.get(`${API_URL}/status`, {
          headers: { Authorization: token },
        });
        this.setState({ statuses: statusRes.data.status || statusRes.data });
      } catch {}
    };
    fetchStatuses();
  }

  openCreateModal = () => this.setState({ openCreate: true });
  closeCreateModal = () => this.setState({ openCreate: false });
  openStatusModal = () => this.setState({ openStatusModal: true });
  closeStatusModal = () => this.setState({ openStatusModal: false });

  toggleStar = (id) =>
    this.setState((prev) => ({
      starred: { ...prev.starred, [id]: !prev.starred[id] },
    }));

  handleCreateTask = async (data) => {
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
      const updatedTasks = [
        ...this.state.tasks,
        { ...newTask, statusId: newTask.status?.id || "" },
      ];
      this.setState({ tasks: updatedTasks });
      saveTasks(updatedTasks);
    } catch {
      const id = `task-${Date.now()}`;
      const localTask = {
        id,
        title: data.title,
        description: data.description,
        statusId: data.statusId,
      };
      const updatedTasks = [...this.state.tasks, localTask];
      this.setState({ tasks: updatedTasks });
      saveTasks(updatedTasks);
    }
    this.closeCreateModal();
  };

  render() {
    const { t } = this.props;
    const { tasks, starred, statuses, openCreate, openStatusModal } =
      this.state;

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
            <button onClick={this.openCreateModal}>
              {t("tasksActions.create")}
            </button>
          </div>
        </div>

        <CreateTaskModel
          isOpen={openCreate}
          closeModal={this.closeCreateModal}
          onCreate={this.handleCreateTask}
        />

        <StatusModal
          isOpen={openStatusModal}
          onClose={this.closeStatusModal}
          onSave={({ title, color }) => {
            axios
              .post(
                `${API_URL}/status`,
                { title, color },
                {
                  headers: { Authorization: sessionStorage.getItem("token") },
                }
              )
              .then((res) => {
                const newStatus = res.data.status || res.data;
                this.setState((prev) => ({
                  statuses: [...prev.statuses, newStatus],
                }));
              });
            this.closeStatusModal();
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
                                isStar
                                  ? t("tasks.starOff")
                                  : t("tasks.starOn")
                              }
                              onClick={() => this.toggleStar(task.id)}
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
                onClick={this.openStatusModal}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withTranslation()(TaskGridPage);
