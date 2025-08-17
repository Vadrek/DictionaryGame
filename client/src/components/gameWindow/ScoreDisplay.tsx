type Props = {
  scoresAndNames: {
    userId: string;
    score: number;
    name: string;
  }[];
};

export const ScoreDisplay = ({ scoresAndNames }: Props) => {
  return (
    <div className="self-start bg-gray-900 p-6 rounded-2xl shadow-lg border-2 border-purple-600">
      <h2 className="text-2xl font-bold text-purple-400 text-center mb-4">
        ⚡ Scores ⚡
      </h2>
      <div className="space-y-2">
        {scoresAndNames.map(({ userId, name, score }) => (
          <div
            key={userId}
            className="flex justify-between items-center px-4 py-2 rounded-lg bg-gray-800 text-white font-mono text-lg hover:bg-gray-700 transition"
          >
            <span className="text-purple-300">{name}</span>
            <span className="font-bold text-yellow-400">{score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
