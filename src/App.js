import React, { useState, useEffect } from "react";
import "./App.css";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import ChatListItem from "./components/ChatListItem";
import ChatIntro from "./components/ChatIntro";
import ChatWindow from "./components/ChatWindow";
import NewChat from "./components/NewChat";
import Login from "./components/Login";
import Loading from "./components/Loading";
import Api from "./Api";
import firebase from "firebase";

function App() {
  const [chatlist, setChatList] = useState([]);
  const [activeChat, setActiveChat] = useState({});
  const [user, setUser] = useState(null);
  const [pendent, setPendent] = useState(false);

  const [showNewChat, setShowNewChat] = useState(false);

  useEffect(() => {
    if (user) {
      let unsub = Api.onChatList(user.id, setChatList);
      return () => unsub;
    }
  }, [user]);

  useEffect(() => {
    setPendent(true);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(1);
        let newUser = {
          id: user.uid,
          name: user.displayName,
          avatar: user.photoURL,
        };
        Api.addUser(newUser);
        setUser(newUser);
      } else {
        setUser(null);
      }
      setPendent(false);
    });
  }, []);

  const SignOut = () => {
    firebase.auth().signOut();
  };

  const handleNewChat = () => {
    setShowNewChat(true);
  };

  if (pendent) {
    return <Loading />;
  }
  if (!user) {
    return <Login />;
  }
  return (
    <div className="app-window">
      <div className="sidebar">
        <NewChat
          chatlist={chatlist}
          user={user}
          show={showNewChat}
          setShow={setShowNewChat}
        />
        <header>
          <img
            className="header--avatar"
            src={user.avatar}
            alt="avatar Image"
          />
          <div className="header--buttons">
            <div className="header--btn">
              <ExitToAppIcon style={{ color: "#919191" }} onClick={SignOut} />
            </div>
            <div className="header--btn">
              <ChatIcon onClick={handleNewChat} style={{ color: "#919191" }} />
            </div>
          </div>
        </header>

        <div className="search">
          <div className="search--input">
            <SearchIcon fontSize="small" />
            <input
              type="search"
              placeholder="Procurar ou começar uma nova conversa"
            />
          </div>
        </div>

        <div className="chatlist">
          {chatlist.map((item, key) => (
            <ChatListItem
              key={key}
              data={item}
              active={activeChat.chatId === item.chatId}
              onClick={() => {
                setActiveChat(item);
              }}
            />
          ))}
        </div>
      </div>

      <div className="contentarea">
        {activeChat.chatId !== undefined && (
          <ChatWindow user={user} data={activeChat} />
        )}
        {activeChat.chatId === undefined && <ChatIntro />}
      </div>
    </div>
  );
}

export default App;
