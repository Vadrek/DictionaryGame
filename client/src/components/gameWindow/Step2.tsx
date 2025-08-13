import { useState } from "react";
import { Definition, Definitions, SocketType } from "./game.types";

import styles from "./Step2.module.scss";
import classNames from "classnames";

export const Step2 = ({
  socket,
  word,
  definitions,
  definitionIdChosen,
}: {
  socket: SocketType;
  word: string;
  definitions: Definitions;
  definitionIdChosen: string;
}) => {
  const definitionList = Object.values(definitions).sort(
    (a: Definition, b: Definition) => (a.content > b.content ? 1 : -1)
  );
  const [definitionVoted, setDefinitionVoted] =
    useState<string>(definitionIdChosen);

  const onClick = (definition: Definition) => {
    socket.emit("choose_definition", { definition });
    setDefinitionVoted(definition.id);
  };

  return (
    <div className={styles.definitionToChooseContainer}>
      <div>{`Mot : ${word}`}</div>
      <div>Trouvez la bonne définition :</div>
      {definitionList.map((definition: Definition) => (
        <div
          key={definition.id}
          className={classNames(styles.definitionItem, {
            [styles.definitionToChoose]: definition.id !== definitionVoted,
            [styles.definitionChosen]: definition.id === definitionVoted,
          })}
          onClick={() => onClick(definition)}
        >
          {definition.content}
        </div>
      ))}
    </div>
  );
};
