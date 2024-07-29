import styles from "./GameCompo.module.css";

export const Step2 = ({ socket, definitions }: any) => {
  const onClick = (definition: string) => {
    socket.emit("choose_definition", { definition });
  };

  return (
    <div className={styles.definitionToChooseContainer}>
      <div>Trouvez la bonne définition :</div>
      {definitions.map((definition: string, index: number) => (
        <div
          key={index}
          className={styles.definitionToChoose}
          onClick={() => onClick(definition)}
        >
          {definition}
        </div>
      ))}
    </div>
  );
};
