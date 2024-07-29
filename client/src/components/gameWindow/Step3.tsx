import { Player } from "./game.types";
import styles from "./GameCompo.module.css";

export const Step3 = ({ players }: { players: Player[] }) => {
  return (
    <div className={styles.definitionToChooseContainer}>
      <div>Résultats</div>
      {/* {players.map(
        ({ id, username, definitionWritten, definitionChosen }: any) => (
          <div key={id} className={styles.definitionToChoose}>
            {username}
          </div>
        )
      )} */}
    </div>
  );
};
