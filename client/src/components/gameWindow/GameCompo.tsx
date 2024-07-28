"use client";
import React, { useEffect, useState } from "react";
import { Button, Form, FormProps } from "antd";
import TextArea from "antd/es/input/TextArea";

import styles from "./GameCompo.module.css";

type FieldType = {
  definition: string;
};

export const GameCompo = ({ socket }: any) => {
  const [definition, setDefinition] = useState<string>("");
  const [word, setWord] = useState<string>("Bonjour");

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    setDefinition(values.definition);
  };

  const onGameStarted = ({ word }: any) => {
    setWord(word);
  };

  useEffect(() => {
    if (socket) {
      socket.on("game_started", onGameStarted);
      return () => {
        socket.off("game_started", onGameStarted);
      };
    }
  }, [socket]);

  return (
    <div className={styles.main_div}>
      <Button onClick={() => socket.emit("start_game")}>Start Game</Button>
      <div>{`Mot : ${word}`}</div>
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
  );
};
