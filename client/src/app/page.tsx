"use client";
import { useEffect, useState } from "react";
import { Col, Row } from "antd";
import { ChatCompo } from "@/components/chatWindow/ChatCompo";

import { GameCompo } from "@/components/gameWindow/GameCompo";
import { useSocket } from "@/socket/hook";

export default function Home() {
  const [username, setUsername] = useState<string>("");

  const socket = useSocket();

  const onConnectionAccepted = ({ username }: any) => {
    setUsername(username);
  };

  useEffect(() => {
    if (socket) {
      socket.on("connection_accepted", onConnectionAccepted);
      return () => {
        socket.off("connection_accepted", onConnectionAccepted);
      };
    }
  }, [socket]);
  return (
    <Row>
      <Col span={8} style={{ backgroundColor: "aliceblue" }}>
        <ChatCompo roomId={"23"} username={username} socket={socket} />
      </Col>
      <Col span={16}>
        <GameCompo socket={socket} />
      </Col>
    </Row>
  );
}
