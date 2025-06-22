import React from "react";
import { withTranslation } from "react-i18next";
import closeIcon from "../../../../assets/close Icon.svg";
import axios from "axios";
import "./CreateTask.css";

const API_URL = import.meta.env.VITE_STARTING_URL;

class CreateTaskModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      status: "",
      statuses: [],
    };
  }

  componentDidMount() {
    if (this.props.isOpen) {
      document.body.style.overflow = "hidden";
      this.initializeForm();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      document.body.style.overflow = "hidden";
      this.initializeForm();
    }

    if (prevProps.isOpen && !this.props.isOpen) {
      document.body.style.overflow = "auto";
    }
  }

  componentWillUnmount() {
    document.body.style.overflow = "auto";
  }

  initializeForm = () => {
    const { editingTask } = this.props;

    if (editingTask) {
      this.setState({
        title: editingTask.title || "",
        description: editingTask.description || "",
        status: editingTask.statusId || "",
      });
    } else {
      this.setState({
        title: "",
        description: "",
        status: "",
      });
    }

    this.fetchStatuses();
  };

  fetchStatuses = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${API_URL}/status`, {
        headers: { Authorization: token },
      });
      this.setState({ statuses: response.data.status || response.data });
    } catch (err) {
      console.error("Error fetching statuses:", err);
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { title, description, status } = this.state;
    const { editingTask, onCreate, onUpdate, onClose } = this.props;

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

    this.setState({
      title: "",
      description: "",
      status: "",
    });

    onClose();
  };

  render() {
    const { isOpen, onClose, t, editingTask } = this.props;
    const { title, description, status, statuses } = this.state;

    if (!isOpen) return null;

    return (
      <div className="create-model-container">
        <div className="modal">
          <div className="modal-head">
            <h1>{t("createTask.title")}</h1>
            <img src={closeIcon} onClick={onClose} alt="Close" />
          </div>
          <form className="action" onSubmit={this.handleSubmit}>
            <div className="labels">
              <label>
                {t("createTask.taskTitle")}
                <input
                  type="text"
                  className="title"
                  name="title"
                  value={title}
                  placeholder={t("createTask.taskTitle")}
                  onChange={this.handleChange}
                  required
                />
              </label>
              <label>
                {t("createTask.description")}
                <textarea
                  name="description"
                  value={description}
                  placeholder={t("createTask.descriptionPlaceholder")}
                  onChange={this.handleChange}
                />
              </label>
              <label>
                {t("createTask.status")}
                <select
                  name="status"
                  value={status}
                  onChange={this.handleChange}
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
  }
}

export default withTranslation()(CreateTaskModel);
