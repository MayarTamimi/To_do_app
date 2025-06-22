import React from "react";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import signin from "../../../assets/sign-in.svg";
import lang from "../../../assets/Lang.svg";
import moon from "../../../assets/Frame.svg";
import { UserContext } from "../../../Hooks/UserContext";
import axios from "axios";
import "./LogIn.css";

const URL = import.meta.env.VITE_STARTING_URL;

class LogIn extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      form: {
        email: "",
        password: "",
      },
      msg: "",
    };
  }

  handleChange = (type, e) => {
    this.setState((prevState) => ({
      form: { ...prevState.form, [type]: e.target.value },
    }));
  };

  handleSubmition = async (e) => {
    e.preventDefault();
    this.setState({ msg: "" });

    try {
      const res = await axios.post(`${URL}/auth/login`, this.state.form);
      sessionStorage.setItem("token", res.data.token);

      const { setAuthenticated } = this.context;
      setAuthenticated(true);
      window.location.href = "/";
    } catch (err) {
      this.setState({ msg: err?.response?.data?.message || "Login failed" });
    }
  };

  toggleLang = () => {
    const { i18n } = this.props;
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  render() {
    const { t } = this.props;
    const { form, msg } = this.state;

    return (
      <>
        <header className="signup-header">
          <img
            src={lang}
            alt="toggle language"
            style={{ cursor: "pointer" }}
            onClick={this.toggleLang}
          />
          <img src={moon} alt="theme toggle" />
        </header>
        <div className="login-container" dir={t("direction")}>
          <div className="left">
            <img src={signin} alt="" />
          </div>
          <div className="right">
            <div className="content">{t("login.title")}</div>
            <h4>{t("login.subtitle")}</h4>
            <form onSubmit={this.handleSubmition}>
              <label>
                {t("login.email")}
                <input
                  type="text"
                  placeholder={t("login.email")}
                  value={form.email}
                  onChange={(e) => this.handleChange("email", e)}
                  required
                />
                {t("login.password")}
                <input
                  type="password"
                  placeholder={t("login.password")}
                  value={form.password}
                  onChange={(e) => this.handleChange("password", e)}
                  required
                />
              </label>
              <button>{t("login.button")}</button>
            </form>
            {msg && <p className="error">{msg}</p>}
            <div className="link">
              {t("login.noAccount")} <Link to="/signup">{t("login.signUp")}</Link>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withTranslation()(LogIn);
