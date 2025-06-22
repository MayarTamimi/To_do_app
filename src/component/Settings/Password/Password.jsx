import React, { useState } from "react";
import { useTranslation , withTranslation} from "react-i18next";
import eyeIcon from "../../../assets/eye.svg";
import "./Password.css";
// import { usePasswordValidation } from "../../../Hooks/UseValidationPassword";
import axios from "axios";

const API_URL = import.meta.env.VITE_STARTING_URL
class Password extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      oldPassword : '',
      newPassword : '',
      visibleOld : false,
      visibleNew : false,
      msg : '',
      isValid : false,
      error : '',
    }

    this.pattern =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    this.message = "Password must be 8–50 characters with at least one letter and one number.";
  }

  validatePassword = (password) => {
    if(password === '') {
      this.setState({isValid : false , error : ''})
    }else if(this.pattern.test(password)) {
      this.setState({isValid : true , error : ''})
    }else {
      this.setState({isValid : false , error : this.message})
    }
  } 

   handleSave = async (e) => {
    e.preventDefault();
    this.setState({ msg: "" });
    try {
      console.log("trd")

      const response = await axios.patch(
        `${API_URL}/user/${sessionStorage.getItem("id")}`,
        { password: newPassword },
        { headers: { Authorization: localStorage.getItem("token") } }
      )
      this.setState({ msg: response.data.message});

    }catch (err) {
      this.setState({ msg: err.response?.data?.error || "Save failed"});
    }
  };

  render(){
  const { t } = this.props
  // const { isValid, error } = usePasswordValidation({password: this.state.newPassword });

  return (
    <div className="password">
      <h2>{t("password.title")}</h2>

      <div className="password-container">
        <label>
          {t("password.old")}
          <div className="password-field">
            <input
              type={this.state.visibleOld ? "text" : "password"}
              value={this.state.oldPassword}
              onChange={(e) => this.setState({ oldPassword: e.target.value })}
              placeholder={t("password.oldPlaceholder")}
            />
            <img
              src={eyeIcon}
              alt="toggle"
              className="eye-icon"
              onClick={() => this.setState(visibleOld => (v) => !v)}
            />
          </div>
        </label>

        <label>
          {t("password.new")}
          <div className="password-field">
            <input
              type={this.state.visibleNew ? "text" : "password"}
              value={this.state.newPassword}
              onChange={(e) => this.setState({ newPassword: e.target.value})}
              placeholder={t("password.newPlaceholder")}
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              required
            />
            <img
              src={eyeIcon}
              alt="toggle"
              className="eye-icon"
              onClick={() => this.setState(visibleNew => ((v) => !v))}
            />
          </div>
        </label>
      </div>
      <div className="save-btn">
      <button
        className="save"
        onClick={this.handleSave}
      >
        {t("password.save")}
      </button>
      </div>
      {this.state.msg && <p className="message">{this.state.msg}</p>}
    </div>
  );
};
}

export default withTranslation()(Password);
