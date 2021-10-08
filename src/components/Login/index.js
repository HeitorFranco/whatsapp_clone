import React from "react";
import Api from "../../Api";

import "./styles.css";
import GoogleLogo from "../../assets/google.png";

const Login = () => {
  const handleGoogleLogin = async () => {
    try {
      await Api.googlePopup();
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
    </div>
  );
};

export default Login;
