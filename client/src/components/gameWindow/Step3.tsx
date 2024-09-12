import { Results } from "./game.types";

import styles from "./Step3.module.scss";

type DataSource = {
  key: string;
  author: string;
  voters: string;
  content: string;
  isReal: boolean;
};

export const Step3 = ({
  word,
  results,
}: {
  word: string;
  results: Results;
}) => {
  const dataSource = Object.values(results)
    .reduce<DataSource[]>((acc, { id, content, author, voters, isReal }) => {
      acc.push({
        key: id,
        content: content,
        author: author?.username || "SOLUTION",
        voters: voters.map((voter) => voter.username).join(", "),
        isReal,
      });
      return acc;
    }, [])
    .sort((a: any, b: any) => {
      if (a.isReal) return -1;
      if (b.isReal) return 1;
      if (a.content > b.content) return 1;
      return -1;
    });

  const goodAnswers = dataSource.filter((definition) => definition.isReal);
  const winners = goodAnswers.length > 0 ? goodAnswers[0].voters : "Personne";

  return (
    <div>
      <div>{`Mot : ${word}`}</div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Définition</th>
            <th>Auteur</th>
            <th>Votes</th>
          </tr>
        </thead>
        <tbody>
          {dataSource.map((definition: DataSource) => {
            return (
              <tr
                key={definition.key}
                className={
                  definition.isReal
                    ? styles.trueDefinition
                    : styles.falseDefinition
                }
              >
                <td>{definition.content}</td>
                <td>{definition.author}</td>
                <td>{definition.voters}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className={styles.scoreRecap}>
        <div>La bonne réponse a été trouvée par :</div>
        {winners}
      </div>
    </div>
  );
};
