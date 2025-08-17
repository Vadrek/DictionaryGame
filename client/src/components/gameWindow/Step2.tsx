import { useState } from 'react';
import { Definition, Definitions, SocketType } from './game.types';
import { StepContainer } from './StepContainer';

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
    (a: Definition, b: Definition) => (a.content > b.content ? 1 : -1),
  );
  const [definitionVoted, setDefinitionVoted] =
    useState<string>(definitionIdChosen);

  const onClick = (definition: Definition) => {
    socket.emit('choose_definition', { definition });
    setDefinitionVoted(definition.id);
  };

  return (
    <StepContainer>
      <div className="text-yellow-400 text-2xl font-bold tracking-wider text-center">
        Mot : {word}
      </div>
      <div className="text-white text-lg font-semibold mb-4 text-center">
        Trouvez la bonne définition :
      </div>

      <div className="flex flex-col gap-3 w-full">
        {definitionList.map((definition: Definition) => {
          const isChosen = definition.id === definitionVoted;
          return (
            <div
              key={definition.id}
              onClick={() => onClick(definition)}
              className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200
                ${isChosen ? 'bg-yellow-500 border-yellow-400 text-black shadow-[0_0_10px_#facc15]' : 'bg-gray-800 border-purple-600 text-white hover:bg-purple-700 hover:shadow-[0_0_8px_#a855f7]'}`}
            >
              {definition.content}
            </div>
          );
        })}
      </div>
    </StepContainer>
  );
};
