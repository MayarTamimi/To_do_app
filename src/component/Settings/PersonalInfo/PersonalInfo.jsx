import React, { useRef, useState, useEffect,  Component } from "react";
import uploader from "../../../assets/upload-btn.svg";
import { withTranslation  } from "react-i18next";
import "./PersonalInfo.css";

class PersonalInfo extends Component {

  constructor (props) {
    super(props);
    this.state = {
      avatar : null,
      currentEmail : sessionStorage.getItem("current_email")
    }
    this.fileInputRef = React.createRef();
  }

  componentDidMount () {
    const {currentEmail} = this.state;  
    const savedAvatar = sessionStorage.getItem(`avatar_${currentEmail}`);
    if (savedAvatar) {
      this.setState({avatar : savedAvatar});
    } else {
      console.warn("No saved avatar found for user:", currentEmail);
    }
  }

  handleClick = () => {
    this.fileInputRef.current.click();
  };
  
  handleFileChange = (e) => {
   const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      sessionStorage.setItem(`avatar_${currentEmail}`, base64String);
      this.setState({avatar : base64String});
    };
    reader.readAsDataURL(file);

  }


  render() {
  const { t } = this.props;
  const { avatar, currentEmail } = this.state;
  return (
    <div className="personal-info">
      <h2>{t("settings.personalInfo")}</h2>
      <div className="img-uploader">
        {avatar ? (
          <img className="user-img" src={avatar} alt="user-profile-img" />
        ) : (
          <>
            <img
              className="user-img"
              src={uploader} 
              alt="default-user-profile"
            />
            {console.warn("Avatar not displayed because no image is set.")}
          </>
        )}

        <div className="upload">
          <img
            src={uploader}
            alt="upload"
            onClick={this.handleClick}
            style={{ cursor: "pointer" }}
          />
          <input
            type="file"
            style={{ display: "none" }}
            ref={this.fileInputRef}
            accept="image/*"
            onChange={this.handleFileChange}
          />
        </div>
      </div>
    </div>
  );
};
}
export default withTranslation()(PersonalInfo);
