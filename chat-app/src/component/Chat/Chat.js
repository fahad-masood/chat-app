import React, { useEffect, useState } from "react";
import { user } from "../Join/Join";
import socketIO from "socket.io-client";
import "./Chat.css";
import Message from "../Message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import closeIcon from "../../images/closeIcon.png";

let socket;

// ENDPOINT is the point from which we receive the socket
const ENDPOINT = "https://demo-guftagu.herokuapp.com/";

const Chat = () => {
  const [id, setid] = useState("");
  const [messages, setMessages] = useState([]);

  const send = () => {
    const message = document.getElementById("chatInput").value;
    if (message) {
      socket.emit("message", { message, id });
      document.getElementById("chatInput").value = "";
    }
  };

  useEffect(() => {
    socket = socketIO(ENDPOINT, { transports: ["websocket"] });

    socket.on("connect", () => {
      setid(socket.id);
    });

    // Sending Data to server side using socket.emit
    socket.emit("joined", { user });

    // Sends the message to the user only
    socket.on("welcome", (data) => {
      setMessages([...messages, data]);
      console.log(data.message);
    });

    // Sends the message to everyone except the user who has joined
    socket.on("userJoined", (data) => {
      setMessages([...messages, data]);
      console.log(data.message);
    });

    socket.on("userLeft", (data) => {
      setMessages([...messages, data]);
      console.log(data.message);
    });

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, []);

  useEffect(() => {
    socket.on("sendMessage", (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message, data.id);
    });
    return () => {
      socket.off();
    };
  }, [messages]);

  return (
    <div className="chatPage">
      <div className="chatContainer">
        <div className="chatHeader">
          <h2>GUFTAGU || گفتگو</h2>
          <a href="/">
            <img src={closeIcon} alt="Close" />
          </a>
        </div>
        <ReactScrollToBottom className="chatBox">
          {messages.map((item, i) => (
            <Message
              user={item.id === id ? "" : item.user}
              message={item.message}
              classs={item.id === id ? "right" : "left"}
            />
          ))}
        </ReactScrollToBottom>
        <div className="inputBox">
          <input
            onKeyPress={(event) => (event.key === "Enter" ? send() : null)}
            type="text"
            id="chatInput"
          />
          <button onClick={send} className="sendBtn">
            <b>SEND</b>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
