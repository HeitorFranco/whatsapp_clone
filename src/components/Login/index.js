import React from "react";
import Api from "../../Api";

const Login = ({ onReceive }) => {
  const handleFacebookLogin = async () => {
    let result = await Api.fbPopup();

    if (result) {
      onReceive(result.user);
    } else {
      alert("Erro");
    }
    console.log(result);
  };

  return (
    <div>
      <button onClick={handleFacebookLogin}>Login com Google</button>
    </div>
  );
};

export default Login;
