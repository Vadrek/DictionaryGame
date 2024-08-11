import { useState } from "react";
import { Button, Form, FormProps } from "antd";
import TextArea from "antd/es/input/TextArea";

import styles from "./Step1.module.scss";
import { SocketType } from "./game.types";

type FieldType = {
  definition: string;
};

export const Step1 = ({
  socket,
  word,
  definitionWritten,
}: {
  socket: SocketType;
  word: string;
  definitionWritten: string;
}) => {
  const [definition, setDefinition] = useState<string>(definitionWritten);

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    setDefinition(values.definition);
    socket.emit("write_definition", { definitionContent: values.definition });
  };

  return (
    <div className={styles.container}>
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
        <div className={styles.definitionResultContainer}>
          <div>Votre définition a été envoyée :</div>
          <div className={styles.definitionResult}>{definition}</div>
          <div>En attente des autres définitions...</div>
        </div>
      )}
    </div>
  );
};
