"use client";
import { useEffect, useState } from "react";
import { Col, Form, FormProps, Input, Row } from "antd";

import { ChatCompo } from "@/components/chatWindow/ChatCompo";
import { GameCompo } from "@/components/gameWindow/GameCompo";
import { useSocket } from "@/socket/hook";

type FieldType = {
  username?: string;
};

export default function Home() {
  const socket = useSocket();
  const [username, setUsername] = useState<string>("");
  const [allUsernames, setAllUsernames] = useState<string[]>([]);
  const [form] = Form.useForm();

  const onConnectionAccepted = ({ myState, allUsernames }: any) => {
    const username = myState.username;
    setUsername(username);
    form.setFieldsValue({ username: username });
    setAllUsernames(allUsernames);
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    if (socket && values.username) {
      setUsername(values.username);
      socket.emit("change_username", { username: values.username });
      sessionStorage.setItem("username", values.username);
    }
  };

  const onUpdateUsernames = ({ allUsernames }: any) => {
    setAllUsernames(allUsernames);
  };

  const onStoreSession = ({ sessionID, userID, username }: any) => {
    if (!socket) return;
    // attach the session ID to the next reconnection attempts
    socket.auth = { sessionID, username };
    // store it in the localStorage
    sessionStorage.setItem("sessionID", sessionID);
    sessionStorage.setItem("username", username);
    // save the ID of the user
    socket.userID = userID;
    socket.username = username;
  };

  useEffect(() => {
    if (socket) {
      const sessionID = sessionStorage.getItem("sessionID");
      const username = sessionStorage.getItem("username");
      socket.auth = { sessionID, username };
      socket.on("connection_accepted", onConnectionAccepted);
      socket.on("update_usernames", onUpdateUsernames);
      socket.on("store_session", onStoreSession);

      return () => {
        socket.off("connection_accepted", onConnectionAccepted);
        socket.off("update_usernames", onUpdateUsernames);
        socket.off("store_session", onStoreSession);
      };
    }
  }, [socket]);

  return (
    <Row>
      <Col span={8} style={{ backgroundColor: "aliceblue" }}>
        <Form
          form={form}
          style={{ maxWidth: 300 }}
          initialValues={{ remember: true, username: username }}
          onFinish={onFinish}
        >
          <Form.Item<FieldType>
            label="Pseudo"
            name="username"
            rules={[{ required: true, message: "your username" }]}
          >
            <Input />
          </Form.Item>
        </Form>

        {`Connectés : ${allUsernames.join(", ")}`}
        <ChatCompo roomId={"23"} username={username} socket={socket} />
      </Col>
      <Col span={16}>{socket && <GameCompo socket={socket} />}</Col>
    </Row>
  );
}
