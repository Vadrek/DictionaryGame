import { Results } from './game.types';
import { StepContainer } from './StepContainer';

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
        content,
        author: author?.username || 'SOLUTION',
        voters: voters.map((voter) => voter.username).join(', ') || 'Personne',
        isReal,
      });
      return acc;
    }, [])
    .sort((a: any, b: any) => {
      if (a.isReal) return -1;
      if (b.isReal) return 1;
      return a.content > b.content ? 1 : -1;
    });

  const goodAnswers = dataSource.filter((definition) => definition.isReal);
  const winners = goodAnswers.length > 0 ? goodAnswers[0].voters : 'personne !';

  return (
    <StepContainer>
      <div className="text-yellow-400 text-2xl font-bold tracking-wider text-center">
        Mot : {word}
      </div>

      <div className="flex flex-col gap-3 w-full">
        {dataSource.map((definition) => (
          <div
            key={definition.key}
            className={`p-2 rounded-lg border-2 transition-all duration-200 
              ${
                definition.isReal
                  ? 'bg-green-600 border-green-400 text-white shadow-[0_0_10px_#22c55e]'
                  : 'bg-gray-800 border-purple-600 text-white hover:bg-purple-700 hover:shadow-[0_0_8px_#a855f7]'
              }`}
          >
            <div className="font-semibold mb-1">{definition.content}</div>
            <div className="text-sm text-yellow-300">
              Auteur: {definition.author}
            </div>
            <div className="text-sm text-blue-300">
              Votes: {definition.voters}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-white text-lg text-center p-3 bg-gray-900 rounded-lg shadow-inner">
        La bonne réponse a été trouvée par :{' '}
        <span className="font-bold text-yellow-400">{winners}</span>
      </div>
    </StepContainer>
  );
};
