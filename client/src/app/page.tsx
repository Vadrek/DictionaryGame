"use client";
import { useEffect, useState } from "react";
import { Col, Row } from "antd";
import { ChatCompo } from "@/components/chatWindow/ChatCompo";

import { GameCompo } from "@/components/gameWindow/GameCompo";
import { useSocket } from "@/socket/hook";

const randomNames = [
  "Alice",
  "Bob",
  "Charlie",
  "David",
  "Eve",
  "Frank",
  "Grace",
  "Heidi",
  "Ivan",
  "Judy",
  "Mallory",
  "Oscar",
];

export default function Home() {
  const [randomUsername, setRandomUsername] = useState<string>("");

  const socket = useSocket();

  useEffect(() => {
    const randomNumber = Math.floor(Math.random() * randomNames.length);
    setRandomUsername(randomNames[randomNumber]);
  }, []);

  return (
    <Row>
      <Col span={8} style={{ backgroundColor: "aliceblue" }}>
        <ChatCompo roomId={"23"} username={randomUsername} socket={socket} />
      </Col>
      <Col span={16}>
        <GameCompo socket={socket} />
      </Col>
    </Row>
  );
}
