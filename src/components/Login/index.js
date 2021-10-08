import React from "react";
import Api from "../../Api";

import "./styles.css";
import GoogleLogo from "../../assets/google.png";

import FacebookIcon from "@material-ui/icons/Facebook";

const Login = () => {
  const handleGoogleLogin = async () => {
    try {
      await Api.googlePopup();
    } catch (error) {
      console.log(error);
    }
  };
  const handleFacebookLogin = async () => {
    try {
      await Api.fbPopup();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-container">
      <button className="btn-google" onClick={handleGoogleLogin}>
        <img src={GoogleLogo} />
        Login com Google
      </button>
      <button className="btn-facebook" onClick={handleFacebookLogin}>
        <FacebookIcon style={{ fontSize: 40, height: 40 }} />
        Login com Facebook
      </button>
    </div>
  );
};

export default Login;
