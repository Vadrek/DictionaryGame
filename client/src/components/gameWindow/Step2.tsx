import { useState } from "react";
import styles from "./GameCompo.module.css";

export const Step2 = ({ socket, definitions }: any) => {
  const [definitionVoted, setDefinitionVoted] = useState<number | null>(null);

  const onClick = (index: number, definition: string) => {
    socket.emit("choose_definition", { definition });
    setDefinitionVoted(index);
  };

  return (
    <div className={styles.definitionToChooseContainer}>
      <div>Trouvez la bonne définition :</div>
      {definitions.map((definition: string, index: number) => (
        <div
          key={index}
          className={
            definitionVoted === index
              ? styles.definitionToChosen
              : styles.definitionToChoose
          }
          onClick={() => onClick(index, definition)}
        >
          {definition}
        </div>
      ))}
    </div>
  );
};
