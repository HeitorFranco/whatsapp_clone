import React from "react";
import Api from "../../Api";

const Login = () => {
  const handleFacebookLogin = async () => {
    try {
      await Api.fbPopup();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button onClick={handleFacebookLogin}>Login com Google</button>
    </div>
  );
};

export default Login;
