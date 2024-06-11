"use client";
import { Button, Col, Form, Row, type FormProps } from "antd";
import styles from "./page.module.css";

// import { getSocket } from "@/socket/singleton";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { ChatCompo } from "@/components/ChatCompo";
// import { useSocket } from "@/socket/useSocketHook";
import {
  useIsSocketConnected,
  useSocketIoClient,
} from "@/hooks/useSocketIoClient";

type FieldType = {
  definition: string;
};

export default function Home() {
  // const socket = useSocket();
  const socket = useSocketIoClient();
  const isSocketConnected = useIsSocketConnected();

  const [definition, setDefinition] = useState<string>("");

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values.definition);
    setDefinition(values.definition);
  };

  return (
    <Row>
      <Col span={8} style={{ backgroundColor: "aliceblue" }}>
        <ChatCompo socket={socket} roomId={"23"} username={"Bob"} />
      </Col>
      <Col span={16}>
        <div>
          <div className={styles.main_div}>
            <div>Mot : bonjour</div>
            <Form onFinish={onFinish}>
              <Form.Item<FieldType>
                label="Inventez une définition"
                name="definition"
                rules={[
                  { required: true, message: "Veuillez écrire une définition" },
                ]}
              >
                <TextArea rows={4} className={styles.definitionText} />
              </Form.Item>
              <Form.Item className={styles.formItem}>
                <Button type="primary" htmlType="submit">
                  Valider
                </Button>
              </Form.Item>
            </Form>
            {definition && (
              <div>
                <div>Votre définition :</div>
                <div className={styles.definitionResult}>{definition}</div>
              </div>
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
}
