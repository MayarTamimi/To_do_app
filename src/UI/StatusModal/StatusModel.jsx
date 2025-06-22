import React from "react";
import { withTranslation } from "react-i18next";
import closeIcon from "../../assets/close Icon.svg";
import "./StatusModal.css";

const COLORS = [
  "#C40461",
  "#6A70EC",
  "#8CADE1",
  "#334D77",
  "#387C00",
  "#744CEE",
  "#BFA6A2",
  "#0079FF",
];

class StatusModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      color: COLORS[0],
    };
  }

  componentDidMount() {
    if (this.props.isOpen) {
      document.body.style.overflow = "hidden";
      this.setState({
        title: this.props.initialTitle || "",
        color: this.props.initialColor || COLORS[0],
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      document.body.style.overflow = "hidden";
      this.setState({
        title: this.props.initialTitle || "",
        color: this.props.initialColor || COLORS[0],
      });
    }

    if (prevProps.isOpen && !this.props.isOpen) {
      document.body.style.overflow = "auto";
    }
  }

  componentWillUnmount() {
    document.body.style.overflow = "auto";
  }

  handleSave = (e) => {
    e.preventDefault();
    const { title, color } = this.state;
    this.props.onSave({ title, color });
    this.props.onClose();
  };

  handleTitleChange = (e) => {
    this.setState({ title: e.target.value });
  };

  handleColorSelect = (c) => {
    this.setState({ color: c });
  };

  render() {
    const { isOpen, onClose, t, isEditing } = this.props;
    const { title, color } = this.state;

    if (!isOpen) return null;

    return (
      <div className="status-modal-backdrop">
        <div className="status-modal">
          <img
            src={closeIcon}
            alt="Close"
            onClick={onClose}
            className="close-icon"
          />

          <h3>
            {isEditing
              ? t("statusModel.editTitle")
              : t("statusModel.createTitle")}
          </h3>

          <form onSubmit={this.handleSave}>
            <label>
              {t("statusModel.titleLabel")}
              <input
                type="text"
                value={title}
                onChange={this.handleTitleChange}
                placeholder={t("statusModel.titlePlaceholder")}
                required
              />
            </label>

            <div className="modal-colors">
              {COLORS.map((c) => (
                <div
                  key={c}
                  onClick={() => this.handleColorSelect(c)}
                  className={`color-swatch ${c === color ? "selected" : ""}`}
                  style={{
                    backgroundColor: c,
                    boxShadow: c === color ? `0 0 0 2px ${c}` : "none",
                  }}
                />
              ))}
            </div>

            <button type="submit">
              {isEditing
                ? t("statusModel.saveButton")
                : t("statusModel.createButton")}
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default withTranslation()(StatusModal);
