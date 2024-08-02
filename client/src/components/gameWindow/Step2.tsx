import { useState } from "react";
import { Definition, Definitions, SocketType } from "./game.types";

import styles from "./GameCompo.module.css";

export const Step2 = ({
  socket,
  definitions,
}: {
  socket: SocketType;
  definitions: Definitions;
}) => {
  const definitionList = Object.values(definitions).sort(
    (a: Definition, b: Definition) => (a.content > b.content ? 1 : -1)
  );
  const [definitionVoted, setDefinitionVoted] = useState<string | null>(null);

  const onClick = (definition: Definition) => {
    socket.emit("choose_definition", { definition });
    setDefinitionVoted(definition.id);
  };

  return (
    <div className={styles.definitionToChooseContainer}>
      <div>Trouvez la bonne définition :</div>
      {definitionList.map((definition: Definition) => (
        <div
          key={definition.id}
          className={
            definitionVoted === definition.id
              ? styles.definitionToChosen
              : styles.definitionToChoose
          }
          onClick={() => onClick(definition)}
        >
          {definition.content}
        </div>
      ))}
    </div>
  );
};
