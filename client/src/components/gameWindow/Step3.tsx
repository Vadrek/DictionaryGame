import { Results } from "./game.types";

import styles from "./Step3.module.scss";

export const Step3 = ({ results }: { results: Results }) => {
  const dataSource = Object.values(results)
    .reduce<any>((acc, { id, content, author, voters, isReal }) => {
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

  return (
    <div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Définition</th>
            <th>Auteur</th>
            <th>Votes</th>
          </tr>
        </thead>
        <tbody>
          {dataSource.map((definition: any) => {
            console.log("definition", definition.content, definition.isReal);
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
    </div>
  );
};
