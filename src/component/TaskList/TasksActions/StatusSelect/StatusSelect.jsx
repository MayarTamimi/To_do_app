import React from "react";
import { withTranslation } from "react-i18next";
import createStatusIcon from "../../../../assets/addStatuse.svg";
import { ThemeContext } from "../../../../Hooks/ThemContext";
import axios from "axios";
import "./StatusSelect.css";

const API_URL = import.meta.env.VITE_STARTING_URL;

class StatusSelect extends React.Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      statuses: [],
    };
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.fetchStatuses();

    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  fetchStatuses = async () => {
    try {
      const response = await axios.get(`${API_URL}/status`, {
        headers: { Authorization: sessionStorage.getItem("token") },
      });
      this.setState({ statuses: response.data.status || response.data });
    } catch (err) {
      console.log("Error fetching statuses:", err);
    }
  };

  handleClickOutside = (e) => {
    if (this.ref.current && !this.ref.current.contains(e.target)) {
      this.setState({ open: false });
    }
  };

  toggleOpen = () => {
    this.setState((prevState) => ({ open: !prevState.open }));
  };

  closeDropdown = () => {
    this.setState({ open: false });
  };

  render() {
    const { value, onChange, placeholder, tasks = [], t } = this.props;
    const { open, statuses } = this.state;
    const { darkMode } = this.context;

    const counts = statuses.reduce((acc, s) => {
      acc[s.id] = tasks.filter((t) => String(t.statusId) === String(s.id)).length;
      return acc;
    }, {});

    const current = statuses.find((s) => String(s.id) === String(value));

    return (
      <div ref={this.ref} className={`status-select ${darkMode ? "dark" : ""}`}>
        <div className="status-select-control" onClick={this.toggleOpen}>
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
                this.closeDropdown();
              }}
            >
              <span className="status-select-label">{t("tasksActions.allStatuses")}</span>
            </div>

            {statuses.map((status) => (
              <div
                key={status.id}
                className="status-select-option"
                onClick={() => {
                  onChange(status.id);
                  this.closeDropdown();
                }}
              >
                <span
                  className="status-select-swatch"
                  style={{ backgroundColor: status.color }}
                />
                <span className="status-select-label">{status.title}</span>
                <span className="status-select-count">{counts[status.id] || 0}</span>
              </div>
            ))}

            <div
              className="status-select-option status-select-option-new"
              onClick={() => {
                onChange("new");
                this.closeDropdown();
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
  }
}

export default withTranslation()(StatusSelect);
