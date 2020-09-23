import React from "react";

import "./styles.css";

const Loading = () => {
  return (
    <div className="loading">
      <img
        src="https://i.pinimg.com/originals/fa/87/77/fa87774590186b287a5338d7c87afc0c.gif"
        alt="Loading..."
      ></img>
      <span>Loading...</span>
    </div>
  );
};

export default Loading;
