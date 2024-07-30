import { Table } from "antd";
import { Results } from "./game.types";

export const Step3 = ({ results }: { results: Results }) => {
  console.log("results", results);

  const columns = [
    {
      title: "Définition",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Auteur",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Votants",
      dataIndex: "voters",
      key: "voters",
    },
  ];

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

  return <Table dataSource={dataSource} columns={columns} />;
};
