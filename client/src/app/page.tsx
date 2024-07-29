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

  const onConnectionAccepted = ({ username, allUsernames }: any) => {
    const sessionUsername = sessionStorage.getItem("username");
    if (sessionUsername) {
      socket.emit("keep_old_username", { username: sessionUsername });
    }
    username = sessionUsername || username;
    setUsername(username);
    form.setFieldsValue({ username: username });
    setAllUsernames(allUsernames);
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    if (values.username) {
      setUsername(values.username);
      socket.emit("change_username", { username: values.username });
      sessionStorage.setItem("username", values.username);
    }
  };

  const onUpdateUsernames = ({ allUsernames }: any) => {
    setAllUsernames(allUsernames);
  };

  useEffect(() => {
    if (socket) {
      socket.on("connection_accepted", onConnectionAccepted);
      socket.on("update_usernames", onUpdateUsernames);

      return () => {
        socket.off("connection_accepted", onConnectionAccepted);
        socket.off("update_usernames", onUpdateUsernames);
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
            label="Username"
            name="username"
            rules={[{ required: true, message: "your username" }]}
          >
            <Input />
          </Form.Item>
        </Form>

        {`Connectés : ${allUsernames.join(", ")}`}
        <ChatCompo roomId={"23"} username={username} socket={socket} />
      </Col>
      <Col span={16}>
        <GameCompo socket={socket} />
      </Col>
    </Row>
  );
}
