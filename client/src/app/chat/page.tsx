"use client";
import styles from "../page.module.css";
import { useState } from "react";
import { ChatCompo } from "@/components/ChatCompo";
import { getSocket } from "@/socket/singleton";

export default function Home() {
  const [showChat, setShowChat] = useState(true);
  const [userName, setUserName] = useState("John");
  const [showSpinner, setShowSpinner] = useState(false);
  const [roomId, setroomId] = useState("23");
  const socket = getSocket();

  const handleJoin = () => {
    if (userName !== "" && roomId !== "") {
      console.log(userName, "userName", roomId, "roomId");
      socket.emit("join_room", roomId);
      setShowSpinner(true);
      // You can remove this setTimeout and add your own logic
      setTimeout(() => {
        setShowChat(true);
        setShowSpinner(false);
      }, 4000);
    } else {
      alert("Please fill in Username and Room Id");
    }
  };

  return (
    <div>
      <div
        className={styles.main_div}
        style={{ display: showChat ? "none" : "" }}
      >
        <input
          className={styles.main_input}
          type="text"
          placeholder="Username2"
          onChange={(e) => setUserName(e.target.value)}
          disabled={showSpinner}
        />
        <input
          className={styles.main_input}
          type="text"
          placeholder="room id"
          onChange={(e) => setroomId(e.target.value)}
          disabled={showSpinner}
        />
        <button className={styles.main_button} onClick={() => handleJoin()}>
          {!showSpinner ? (
            "Join"
          ) : (
            <div className={styles.loading_spinner}></div>
          )}
        </button>
      </div>
      <div style={{ display: !showChat ? "none" : "" }}>
        <ChatCompo socket={socket} roomId={roomId} username={userName} />
      </div>
    </div>
  );
}
