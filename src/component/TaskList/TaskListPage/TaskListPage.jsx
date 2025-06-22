import React from "react";
import Header from "../../../UI/Header/Header";
import grid from "../../../assets/grid.svg";
import table from "../../../assets/table.svg";
import search from "../../../assets/search.svg";
import TasksTable from "../Table/TasksTable/TasksTable";
import { withTranslation } from "react-i18next";
import CreateTaskModel from "../TasksActions/CreateTask/CreateTaskModel";
import { Link } from "react-router-dom";
import StatusModal from "../../../UI/StatusModal/StatusModel";
import StatusSelect from "../TasksActions/StatusSelect/StatusSelect";
import {
  openDB,
  addTaskToIndexedDB as saveTasks,
  getAllTasks,
} from "../../../Utils/indexedDB";
import axios from "axios";
import "./TaskListPage.css";

const API_URL = import.meta.env.VITE_STARTING_URL;

class TaskListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      editingTask: null,
      tasks: [],
      searchTerm: '',
      statuses: [],
      selectedStatus: null,
      isStatusModalOpen: false,
    };

    this.underlineRef = React.createRef();
    this.tabRefs = {
      table: React.createRef(),
      grid: React.createRef()
    };
  }

  componentDidMount() {
    this.loadTasks();
    this.loadStatuses();
  }

  loadTasks = () => {
    openDB(async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.post(
          `${API_URL}/task`,
          {},
          { headers: { Authorization: token } }
        );
        const apiTasks = (response.data.tasks || response.data).map((task) => ({
          ...task,
          statusId: task.status?.id || "",
        }));
        this.setState({ tasks: apiTasks });
        saveTasks(apiTasks);
      } catch {
        getAllTasks((tasks) => this.setState({ tasks }));
      }
    });
  };

  loadStatuses = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${API_URL}/status`, {
        headers: { Authorization: token },
      });
      this.setState({ statuses: response.data.status || response.data });
    } catch {}
  };

  openCreateModal = () => {
    this.setState({ editingTask: null, isOpen: true });
  };

  openEditModal = (task) => {
    this.setState({ editingTask: task, isOpen: true });
  };

  closeModal = () => {
    this.setState({ editingTask: null, isOpen: false });
  };

  addTasks = async (newTask) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/task`,
        newTask,
        { headers: { Authorization: token } }
      );
      const created = response.data.task || response.data;
      const next = [
        ...this.state.tasks,
        { ...created, statusId: created.status?.id || "" },
      ];
      this.setState({ tasks: next });
      saveTasks(next);
    } catch {}
  };

  handleUpdateTask = async (updatedTask) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.patch(
        `${API_URL}/task/${updatedTask.id}`,
        updatedTask,
        {
          headers: { Authorization: token },
        }
      );
      const updated = res.data.task || res.data;
      const next = this.state.tasks.map((t) =>
        t.id === updated.id
          ? { ...updated, statusId: updated.status?.id || "" }
          : t
      );
      this.setState({ tasks: next });
      saveTasks(next);
    } catch {}
  };

  handleDeleteTask = async (taskId) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`${API_URL}/task/${taskId}`, {
        headers: { Authorization: token },
      });
      const next = this.state.tasks.filter((t) => t.id !== taskId);
      this.setState({ tasks: next });
      saveTasks(next);
    } catch {}
  };

  handleSaveStatus = async ({ title, color }) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/status`,
        { title, color },
        { headers: { Authorization: token } }
      );
      const newStatus = res.data.status || res.data;
      this.setState((prevState) => ({
        statuses: [...prevState.statuses, newStatus],
        selectedStatus: newStatus.id,
        isStatusModalOpen: false,
      }));
    } catch {}
  };

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  handleStatusChange = (value) => {
    this.setState({ selectedStatus: value });
  };

  render() {
    const { t } = this.props;
    const {
      isOpen,
      editingTask,
      tasks,
      searchTerm,
      statuses,
      selectedStatus,
      isStatusModalOpen,
    } = this.state;

    const filteredTasks = tasks
      .filter((task) => {
        const term = searchTerm.toLowerCase();
        return (
          task.title?.toLowerCase().includes(term) ||
          task.description?.toLowerCase().includes(term) ||
          task.status?.title?.toLowerCase().includes(term)
        );
      })
      .filter((task) =>
        selectedStatus ? task.statusId === selectedStatus : true
      );

    return (
      <div>
        <Header />
        <div className="tabs-container">
          <div className="tabs">
            <div className="table-tab" ref={this.tabRefs.table}>
              <img src={table} alt="Table View" />
              <p>{t("tabs.table")}</p>
            </div>
            <Link to="/grid">
              <div className="grid-tab" ref={this.tabRefs.grid}>
                <img src={grid} alt="Grid View" />
                <p>{t("tabs.grid")}</p>
              </div>
            </Link>
            <span className="underline" ref={this.underlineRef} />
          </div>
          <div className="create">
            <button onClick={this.openCreateModal}>{t("tasksActions.create")}</button>
          </div>
        </div>

        <div className="actions">
          <div className="search">
            <img src={search} alt="Search" />
            <input
              type="text"
              value={searchTerm}
              onChange={this.handleSearchChange}
              placeholder={t("tasksActions.search")}
            />
          </div>
          <div className="status">
            <StatusSelect
              statuses={statuses}
              value={selectedStatus}
              tasks={tasks}
              onChange={this.handleStatusChange}
              placeholder={t("tasksActions.status")}
            />
          </div>
        </div>

        <TasksTable
          tasks={filteredTasks}
          searchTerm={searchTerm}
          onDelete={this.handleDeleteTask}
          onEdit={this.openEditModal}
        />

        <CreateTaskModel
          isOpen={isOpen}
          closeModal={this.closeModal}
          onCreate={this.addTasks}
          onUpdate={this.handleUpdateTask}
          editingTask={editingTask}
        />

        <StatusModal
          isOpen={isStatusModalOpen}
          onClose={() => this.setState({ isStatusModalOpen: false })}
          onSave={this.handleSaveStatus}
        />
      </div>
    );
  }
}

export default withTranslation()(TaskListPage);
