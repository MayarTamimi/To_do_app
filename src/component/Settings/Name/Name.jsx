import React from "react";
import { withTranslation } from "react-i18next";
import axios from "axios";
import "./Name.css";
import { UserContext } from "../../../Hooks/UserContext";

const API_URL = import.meta.env.VITE_STARTING_URL;

class Name extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      msg: "",
    };
  }

  async componentDidMount() {
    const { setUser } = this.context;

    if (sessionStorage.getItem("name")) {
      this.setState({ name: sessionStorage.getItem("name") });
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/user`, {
        headers: { Authorization: sessionStorage.getItem("token") },
      });
      sessionStorage.setItem("name", res.data.name);
      sessionStorage.setItem("id", res.data.id);
      this.setState({ name: res.data.name });
      setUser({ name: res.data.name, id: res.data.id });
    } catch (err) {
      this.setState({ msg: "Failed to load user data." });
    }
  }

  handleSave = async (e) => {
    e.preventDefault();
    const { name } = this.state;

    try {
      const res = await axios.patch(
        `${API_URL}/user/${sessionStorage.getItem("id")}`,
        { name },
        { headers: { Authorization: sessionStorage.getItem("token") } }
      );
      this.setState({ name: res.data.name, msg: res.data.message });
      sessionStorage.setItem("name", res.data.name);
    } catch (err) {
      this.setState({
        msg: err.response?.data?.error || "Save failed",
      });
    }
  };

  render() {
    const { t } = this.props;
    const { name, msg } = this.state;

    return (
      <div className="name">
        <label htmlFor="name-input">{t("settings.fullName")}</label>
        <input
          id="name-input"
          type="text"
          value={name}
          onChange={(e) => this.setState({ name: e.target.value })}
          placeholder={t("settings.namePlaceholder")}
        />
        <div className="save-btn">
          <button className="save" onClick={this.handleSave}>
            {t("settings.save")}
          </button>
        </div>
        {msg && <p className="message">{msg}</p>}
      </div>
    );
  }
}

export default withTranslation()(Name);
