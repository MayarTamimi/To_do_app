import React, { useState, useEffect, useRef } from "react";
import Header from "../../../UI/Header/Header";
import grid from "../../../assets/grid.svg";
import table from "../../../assets/table.svg";
import search from "../../../assets/search.svg";
import TasksTable from "../Table/TasksTable/TasksTable";
import { useTranslation } from "react-i18next";
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

const TaskListPage = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const underlineRef = useRef(null);
  const tabRefs = { table: useRef(null), grid: useRef(null) };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsOpen(true);
  };
  const openEditModal = (task) => {
    setEditingTask(task);
    setIsOpen(true);
  };
  const closeModal = () => {
    setEditingTask(null);
    setIsOpen(false);
  };

  useEffect(() => {
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
        setTasks(apiTasks);
        saveTasks(apiTasks);
      } catch {
        getAllTasks(setTasks);
      }
    });
    (async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get(`${API_URL}/status`, {
          headers: { Authorization: token },
        });
        setStatuses(res.data.status || res.data);
      } catch {}
    })();
  }, []);

  const addTasks = async (newTask) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/task`,
        {
          title: newTask.title,
          description: newTask.description,
          statusId: newTask.statusId,
        },
        { headers: { Authorization: token } }
      );
      const created = response.data.task || response.data;
      const next = [
        ...tasks,
        { ...created, statusId: created.status?.id || "" },
      ];
      setTasks(next);
      saveTasks(next);
    } catch {}
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const token = sessionStorage.getItem("token");
      const payload = {
        title: updatedTask.title,
        description: updatedTask.description,
        statusId: updatedTask.statusId,
      };
      const res = await axios.patch(
        `${API_URL}/task/${updatedTask.id}`,
        payload,
        {
          headers: { Authorization: token },
        }
      );
      const updated = res.data.task || res.data;
      const next = tasks.map((t) =>
        t.id === updated.id
          ? { ...updated, statusId: updated.status?.id || "" }
          : t
      );
      setTasks(next);
      saveTasks(next);
    } catch {}
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`${API_URL}/task/${taskId}`, {
        headers: { Authorization: token },
      });
      const next = tasks.filter((t) => t.id !== taskId);
      setTasks(next);
      saveTasks(next);
    } catch {}
  };

  const handleSaveStatus = async ({ title, color }) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/status`,
        { title, color },
        { headers: { Authorization: token } }
      );
      const newStatus = res.data.status || res.data;
      setStatuses((prev) => [...prev, newStatus]);
      setSelectedStatus(newStatus.id);
      setIsStatusModalOpen(false);
    } catch {}
  };

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
          <div className="table-tab" ref={tabRefs.table}>
            <img src={table} alt="Table View" />
            <p>{t("tabs.table")}</p>
          </div>
          <Link to="/grid">
            <div className="grid-tab" ref={tabRefs.grid}>
              <img src={grid} alt="Grid View" />
              <p>{t("tabs.grid")}</p>
            </div>
          </Link>
          <span className="underline" ref={underlineRef} />
        </div>
        <div className="create">
          <button onClick={openCreateModal}>{t("tasksActions.create")}</button>
        </div>
      </div>
      <div className="actions">
        <div className="search">
          <img src={search} alt="Search" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("tasksActions.search")}
          />
        </div>
        <div className="status">
          <StatusSelect
            statuses={statuses}
            value={selectedStatus}
            tasks={tasks}
            onChange={(v) => setSelectedStatus(v)}
            placeholder={t("tasksActions.status")}
          />
        </div>
      </div>
      <TasksTable
        tasks={filteredTasks}
        searchTerm={searchTerm}
        onDelete={handleDeleteTask}
        onEdit={openEditModal}
      />
      <CreateTaskModel
        isOpen={isOpen}
        closeModal={closeModal}
        onCreate={addTasks}
        onUpdate={handleUpdateTask}
        editingTask={editingTask}
      />
      <StatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onSave={handleSaveStatus}
      />
    </div>
  );
};

export default TaskListPage;
