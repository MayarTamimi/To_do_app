import React, { Component } from "react";
import axios from "axios";
import pencile from "../../../assets/PencilLine.svg";
import trash from "../../../assets/Trash.svg";
import { withTranslation } from "react-i18next";
import StatusModal from "../../../UI/StatusModal/StatusModel";
import "./Status.css";

const API_URL = import.meta.env.VITE_STARTING_URL;

const initialStatuses = [
  { id: "1", title: "To do", color: "#6A70EC" },
  { id: "2", title: "Done", color: "#387C00" },
  { id: "3", title: "In Progress", color: "#0079FF" },
];

class Status extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statuses: initialStatuses,
      modalOpen: false,
      editingStatus: null,
    };
  }

  componentDidMount() {
    const getStatuses = async () => {
      try {
        const response = await axios.get(`${API_URL}/status`, {
          headers: { Authorization: sessionStorage.getItem("token") },
        });
        this.setState({ statuses: response.data.status });
      } catch (err) {
        console.error("Error fetching statuses:", err);
      }
    };

    getStatuses();
  }

  openEdit = (status) => {
    this.setState({ editingStatus: status, modalOpen: true });
  };

  closeModal = () => {
    this.setState({ modalOpen: false, editingStatus: null });
  };

  handleSave = async ({ title, color }) => {
    const { editingStatus } = this.state;
    if (!editingStatus) return;

    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.patch(
        `${API_URL}/status/${editingStatus.id}`,
        { title, color },
        { headers: { Authorization: token } }
      );

      const updatedStatus = res.data.status;

      this.setState((prevState) => ({
        statuses: prevState.statuses.map((s) =>
          s.id === updatedStatus.id ? updatedStatus : s
        ),
        modalOpen: false,
        editingStatus: null,
      }));
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  handleDeleteStatus = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`${API_URL}/status/${id}`, {
        headers: { Authorization: token },
      });

      this.setState((prevState) => ({
        statuses: prevState.statuses.filter((s) => s.id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete status:", error);
    }
  };

  handleAddStatus = async ({ title, color }) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/status`,
        { title, color },
        { headers: { Authorization: token } }
      );
      const newStatus = res.data.status;

      this.setState((prevState) => ({
        statuses: [...prevState.statuses, newStatus],
        modalOpen: false,
      }));
    } catch (error) {
      console.error("Failed to add status:", error);
    }
  };

  render() {
    const { t } = this.props;
    const { statuses, modalOpen, editingStatus } = this.state;

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
                <img
                  src={pencile}
                  alt="Edit"
                  onClick={() => this.openEdit(s)}
                />
                <img
                  src={trash}
                  alt="Delete"
                  onClick={() => this.handleDeleteStatus(s.id)}
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
          onClose={this.closeModal}
          onSave={editingStatus ? this.handleSave : this.handleAddStatus}
        />
      </div>
    );
  }
}

export default withTranslation()(Status);
