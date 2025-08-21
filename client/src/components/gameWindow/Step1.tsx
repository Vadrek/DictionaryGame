import { useState } from 'react';
import { Button } from '../buttons/buttons';
import { SocketType } from './game.types';

export const Step1 = ({
  socket,
  word,
  definitionWritten,
}: {
  socket: SocketType;
  word: string;
  definitionWritten: string;
}) => {
  const [definition, setDefinition] = useState<string>(definitionWritten);
  const [draft, setDraft] = useState<string>(definitionWritten);

  const onSubmit = () => {
    if (!draft) return;
    setDefinition(draft);
    socket.emit('write_definition', { definitionContent: draft });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <>
      <div className="text-yellow-400 text-2xl font-bold tracking-wider text-center">
        Mot : {word}
      </div>

      <div className="flex flex-col w-full gap-4">
        <label className="text-lg text-white font-semibold mb-1">
          Inventez une définition
        </label>
        <textarea
          rows={4}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-gray-800 text-white p-3 rounded-md border-2 border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-400 resize-none"
          placeholder="Écrivez votre définition ici... (Shift+Enter pour nouvelle ligne)"
        />
        <Button
          variant="secondary"
          type="button"
          onClick={onSubmit}
          className="self-end"
        >
          Valider
        </Button>
      </div>

      {definition && (
        <div className="bg-gray-900 text-white p-4 rounded-md w-full border-2 border-purple-600 mt-4 flex flex-col gap-2 break-words">
          <div className="text-yellow-300 font-bold">
            Votre définition a été envoyée :
          </div>
          <div className="text-white italic p-2 bg-gray-800 rounded whitespace-pre-wrap break-words">
            {definition}
          </div>
          <div className="text-gray-400 text-sm">
            En attente des autres définitions...
          </div>
        </div>
      )}
    </>
  );
};
