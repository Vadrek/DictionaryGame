import { useState } from "react";
import { Button, Form, FormProps } from "antd";
import TextArea from "antd/es/input/TextArea";

import styles from "./GameCompo.module.css";

type FieldType = {
  definition: string;
};

export const Step1 = ({ socket, word }: any) => {
  const [definition, setDefinition] = useState<string>("");

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    setDefinition(values.definition);
    socket.emit("write_definition", { definitionContent: values.definition });
  };

  return (
    <>
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
          <div>Votre définition a été envoyée :</div>
          <div className={styles.definitionResult}>{definition}</div>
        </div>
      )}
    </>
  );
};
