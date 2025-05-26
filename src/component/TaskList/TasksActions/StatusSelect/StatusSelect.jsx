import React, { useState, useRef, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import createStatusIcon from "../../../../assets/addStatuse.svg";
import { ThemeContext } from "../../../../Hooks/ThemContext";
import axios from "axios";
import "./StatusSelect.css";

const API_URL = import.meta.env.VITE_STARTING_URL;

const StatusSelect = ({ value, onChange, placeholder, tasks = [] }) => {
  const { t } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  const [open, setOpen] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`${API_URL}/status`, {
          headers: { Authorization: sessionStorage.getItem("token") },
        });
        setStatuses(response.data.status || response.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const counts = statuses.reduce((acc, s) => {
    acc[s.id] = tasks.filter((t) => String(t.statusId) === String(s.id)).length;
    return acc;
  }, {});

  const current = statuses.find((s) => String(s.id) === String(value));

  return (
    <div ref={ref} className="status-select">
      <div className="status-select-control" onClick={() => setOpen((o) => !o)}>
        {current ? (
          <>
            <span
              className="status-select-swatch"
              style={{ backgroundColor: current.color }}
            />
            <span className="status-select-label">{current.title}</span>
          </>
        ) : (
          <span className="status-select-placeholder">{placeholder}</span>
        )}
        <span className={`status-select-arrow ${open ? "open" : ""}`}>▾</span>
      </div>

      {open && (
        <div className="status-select-menu">
          <div
            className="status-select-option"
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
          >
            <span className="status-select-label">
              {t("tasksActions.allStatuses")}
            </span>
          </div>

          {statuses.map((status) => (
            <div
              key={status.id}
              className="status-select-option"
              onClick={() => {
                onChange(status.id);
                setOpen(false);
              }}
            >
              <span
                className="status-select-swatch"
                style={{ backgroundColor: status.color }}
              />
              <span className="status-select-label">{status.title}</span>
              <span className="status-select-count">
                {counts[status.id] || 0}
              </span>
            </div>
          ))}

          <div
            className="status-select-option status-select-option-new"
            onClick={() => {
              onChange("new");
              setOpen(false);
            }}
          >
            <img src={createStatusIcon} alt="" className="status-select-icon" />
            <span className="status-select-label">
              {t("createTask.createStatus")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusSelect;