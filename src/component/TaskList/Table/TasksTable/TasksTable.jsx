import React, { Component, createRef } from "react";
import { withTranslation } from "react-i18next";
import star from "../../../../assets/star.svg";
import fullStar from "../../../../assets/fillStar.svg";
import dots from "../../../../assets/dots.svg";
import EmptyTasks from "../../EmptyTasks/EmptyTasks";
import TaskSettingsMenu from "../TaskSettings/TaskSettingsMenu";
import DeleteStatus from "../../TasksActions/DeleteStatus/DeleteStatus";
import arrowLeft from "../../../../assets/arrowLeft.svg";
import arrowRight from "../../../../assets/arrowRight.svg";
import "./TasksTable.css";

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

class TasksTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      starred: {},
      openMenuFor: null,
      showDeleteModalFor: null,
      currentPage: 1,
    };
    this.dotsRefs = {};
  }

  toggleStar = (id) => {
    this.setState((prev) => ({
      starred: { ...prev.starred, [id]: !prev.starred[id] },
    }));
  };

  handleDotsClick = (id) => {
    this.setState((prev) => ({
      openMenuFor: prev.openMenuFor === id ? null : id,
    }));
  };

  handleInitiateDelete = (id) => {
    this.setState({ showDeleteModalFor: id, openMenuFor: null });
  };

  confirmDelete = () => {
    this.props.onDelete(this.state.showDeleteModalFor);
    this.setState({ showDeleteModalFor: null });
  };

  cancelDelete = () => {
    this.setState({ showDeleteModalFor: null });
  };

  highlightText = (text, highlight) => {
    if (!highlight) return text;
    const regex = new RegExp(`(${highlight})`, "gi");
    return text
      .split(regex)
      .map((part, i) =>
        regex.test(part) ? <mark key={i}>{part}</mark> : part
      );
  };

  render() {
    const { tasks, onEdit, t, searchTerm } = this.props;
    const { starred, openMenuFor, showDeleteModalFor, currentPage } =
      this.state;
    const tasksPerPage = 8;

    if (tasks.length === 0)
      return <EmptyTasks openModal={() => onEdit(null)} />;

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(tasks.length / tasksPerPage);

    return (
      <>
        <table className="tasks-table">
          <thead>
            <tr>
              <th>{t("tasks.title")}</th>
              <th>{t("tasks.description")}</th>
              <th>{t("tasks.Status")}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {currentTasks.map((task) => {
              const id = task.id;
              const isStar = !!starred[id];
              const isMenuOpen = openMenuFor === id;
              const rect = this.dotsRefs[id]?.getBoundingClientRect() || {};
              const position = {
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX,
              };
              const statusColor = task.status?.color || "#f0f0f0";
              const lightStatusColor = lightenColor(statusColor, 0.85);

              return (
                <tr key={id}>
                  <td className="title">
                    <img
                      src={isStar ? fullStar : star}
                      alt={isStar ? t("tasks.starOff") : t("tasks.starOn")}
                      onClick={() => this.toggleStar(id)}
                      className="tasks-table__star"
                    />
                    <span>{this.highlightText(task.title, searchTerm)}</span>
                  </td>
                  <td>{this.highlightText(task.description, searchTerm)}</td>
                  <td>
                    <button
                      disabled
                      style={{
                        backgroundColor: lightStatusColor,
                        color: "#333",
                        border: "none",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontWeight: "600",
                        cursor: "default",
                        userSelect: "none",
                      }}
                    >
                      {t(task.status?.title)}
                    </button>
                  </td>
                  <td>
                    <img
                      src={dots}
                      alt={t("tasks.menu")}
                      ref={(el) => (this.dotsRefs[id] = el)}
                      onClick={() => this.handleDotsClick(id)}
                      className="tasks-table__dots"
                    />
                    {isMenuOpen && (
                      <TaskSettingsMenu
                        position={position}
                        onChangeTo={() => console.log("Change status", id)}
                        onEdit={() => {
                          onEdit(task);
                          this.setState({ openMenuFor: null });
                        }}
                        onDelete={() => this.handleInitiateDelete(id)}
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="pagination-controls">
          <button
            className="left-btn"
            onClick={() =>
              this.setState((prev) => ({
                currentPage: Math.max(prev.currentPage - 1, 1),
              }))
            }
            disabled={currentPage === 1}
          >
            {t("tasks.previous")}
            <img src={arrowLeft} alt="" />
          </button>
          <span>
            {currentPage} of {totalPages}
          </span>
          <button
            className="right-btn"
            onClick={() =>
              this.setState((prev) => ({
                currentPage: Math.min(prev.currentPage + 1, totalPages),
              }))
            }
            disabled={currentPage === totalPages}
          >
            {t("tasks.next")}
            <img src={arrowRight} alt="" />
          </button>
        </div>

        {showDeleteModalFor !== null && (
          <DeleteStatus
            onConfirm={this.confirmDelete}
            onClose={this.cancelDelete}
          />
        )}
      </>
    );
  }
}

export default withTranslation()(TasksTable);
