import React, { useEffect, useState } from "react";

import "./styles.css";

const MessageItem = ({ data, user, type }) => {
  const [time, setTime] = useState("");
  useEffect(() => {
    if (data.date > 0) {
      let d = new Date(data.date.seconds * 1000);
      let hours = d.getHours();
      let minutes = d.getMinutes();
      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      setTime(`${hours}:${minutes}`);
    }
  }, [data]);

  return (
    <div
      className="messageLine"
      style={{
        justifyContent: user.id === data.author ? "flex-end" : "flex-start",
      }}
    >
      <div
        className="messageItem"
        style={{ background: user.id === data.author ? "#dcf8c6" : "#fff" }}
      >
        {type === "text" && (
          <>
            <div className="messageText">{data.body}</div>
            <div className="messageDate">{time}</div>
          </>
        )}
        {type === "img" && (
          <>
            <img src={data.body} className="Image"></img>
            <div className="messageDate">{time}</div>
          </>
        )}
        <span className="messageText">{data.body}</span>
        <div className="messageDate">{time}</div>
      </div>
    </div>
  );
};

export default MessageItem;
