"use client";
import React, { useEffect, useState } from "react";
import style from "./ChatCompo.module.scss";

interface IMsgDataTypes {
  user: string;
  msg: string;
}

export const ChatCompo = ({ username, roomId, socket }: any) => {
  const [currentMsg, setCurrentMsg] = useState("");
  const [chat, setChat] = useState<IMsgDataTypes[]>([]);

  const sendData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentMsg !== "") {
      const msgData: IMsgDataTypes = {
        user: username,
        msg: currentMsg,
      };
      socket.emit("send_msg", msgData);
      setCurrentMsg("");
    }
  };

  const onReceiveMsg = (data: IMsgDataTypes) => {
    setChat((pre) => [...pre, data]);
    const objDiv = document.getElementById("chatMessages");
    if (objDiv) {
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  };

  useEffect(() => {
    if (socket == null) return;
    socket.on("receive_msg", onReceiveMsg);
    return () => {
      socket.off("receive_msg", onReceiveMsg);
    };
  }, [socket]);

  return (
    <div className={style.chat_div}>
      <div className={style.chat_border}>
        <div style={{ marginBottom: "1rem" }}></div>
        <div id="chatMessages" className={style.chatMessages}>
          {chat.map(({ user, msg }, key) => (
            <div
              key={key}
              className={
                user == username
                  ? style.chatProfileRight
                  : style.chatProfileLeft
              }
            >
              <span
                className={style.chatProfileSpan}
                style={{ textAlign: user == username ? "right" : "left" }}
              >
                {user.charAt(0)}
              </span>
              <p style={{ textAlign: user == username ? "right" : "left" }}>
                {msg}
              </p>
            </div>
          ))}
        </div>
        <div>
          <form onSubmit={(e) => sendData(e)}>
            <input
              className={style.chat_input}
              type="text"
              value={currentMsg}
              placeholder="Votre message..."
              onChange={(e) => setCurrentMsg(e.target.value)}
            />
            <button className={style.chat_button}>Envoyer</button>
          </form>
        </div>
      </div>
    </div>
  );
};
