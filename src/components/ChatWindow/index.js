import React, { useCallback, useEffect, useState, useRef } from "react";
import EmojiPicker from "emoji-picker-react";

import "./styles.css";
import SearchIcon from "@material-ui/icons/Search";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import CloseIcon from "@material-ui/icons/Close";
import SendIcon from "@material-ui/icons/Send";
import MicIcon from "@material-ui/icons/Mic";

import MessageItem from "../MessageItem";
import { DoubleArrow } from "@material-ui/icons";
import Api from "../../Api";

const ChatWindow = ({ user, data }) => {
  const body = useRef();

  let recognition = null;
  let SpechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpechRecognition !== undefined) {
    recognition = new SpechRecognition();
  }

  const [emojiOpen, setEmojiOpen] = useState(false);
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [list, setList] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (body.current.scrollHeight > body.current.offsetHeight) {
      body.current.scrollTop =
        body.current.scrollHeight - body.current.offsetHeight;
    }
    console.log("tttt");
  }, [list]);

  useEffect(() => {
    setList([]);
    let unsub = Api.onChatContent(data.chatId, setList, setUsers);
  }, [data.chatId]);

  const handleFile = async (e) => {
    const url = await Api.AddFileStorage(e.target.files[0]);
    Api.sendMessage(data, user.id, "img", url, users);
  };

  const handleEmojiClick = useCallback((e, emojiObject) => {
    setText((old) => old + emojiObject.emoji);
  }, []);
  const handleOpenEmoji = useCallback(() => {
    setEmojiOpen(true);
  }, []);
  const handleCloseEmoji = useCallback(() => {
    setEmojiOpen(false);
  }, []);
  const handleChange = useCallback((e) => {
    setText(e.target.value);
  }, []);
  const handleMicClick = () => {
    if (recognition !== null) {
      recognition.onstart = () => {
        setListening(true);
      };
      recognition.onend = () => {
        setListening(false);
      };
      recognition.onresult = (e) => {
        setText(e.results[0][0].transcript);
      };

      recognition.start();
    } else {
      alert("Sem Suporte!");
    }
  };
  const handleInputKeyUp = (e) => {
    if (e.keyCode === 13) {
      handleSendClick();
    }
  };

  const handleSendClick = () => {
    if (text !== "") {
      Api.sendMessage(data, user.id, "text", text, users);
      setText("");
      setEmojiOpen(false);
    }
  };

  return (
    <div className="chatWindow">
      <header className="chatWindow--header">
        <div className="chatWindow--headerinfo">
          <img
            className="chatWindow--avatar"
            src={data.image}
            alt="Avata"
          ></img>
          <div className="chatWindow--name">{data.title}</div>
        </div>

        <div className="chatWindow--headerbuttons">
          <input id="if" type="file" onChange={handleFile} hidden></input>
          <label for="if">
            <div className="chatWindow--btn">
              <AttachFileIcon style={{ color: "#919191" }} />
            </div>
          </label>
        </div>
      </header>
      <div className="chatWindow--body" ref={body}>
        {list.map((item, key) => (
          <MessageItem key={key} data={item} type={item.type} user={user} />
        ))}
      </div>

      <div
        className="chatWindow--emojiarea"
        style={{ height: emojiOpen ? "250px" : "0" }}
      >
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          disableSearchBar
          disableSkinTonePicker
        />
      </div>

      <footer className="chatWindow--footer">
        <div className="chatWindow--pre">
          <div
            className="chatWindow--btn"
            onClick={handleCloseEmoji}
            style={{ width: emojiOpen ? "40px" : "0px" }}
          >
            <CloseIcon style={{ color: "#919191" }} />
          </div>

          <div className="chatWindow--btn" onClick={handleOpenEmoji}>
            <InsertEmoticonIcon
              style={{ color: emojiOpen ? "#009688" : "#919191" }}
            />
          </div>
        </div>

        <div className="chatWindow--inputarea">
          <input
            value={text}
            className="chatWindow--input"
            type="text"
            placeholder="Digite uma mensagem"
            onChange={handleChange}
            onKeyUp={handleInputKeyUp}
          ></input>
        </div>

        <div className="chatWindow--pos">
          {text === "" && (
            <div
              onClick={listening ? () => {} : handleMicClick}
              className="chatWindow--btn"
            >
              <MicIcon style={{ color: listening ? "#126ece" : "#919191" }} />
            </div>
          )}

          {text !== "" && (
            <div onClick={handleSendClick} className="chatWindow--btn">
              <SendIcon style={{ color: "#919191" }} />
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default ChatWindow;
