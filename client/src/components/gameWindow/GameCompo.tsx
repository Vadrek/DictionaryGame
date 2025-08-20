import React, { useEffect, useState } from 'react';

import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { Definitions, Results, SocketType } from './game.types';

import { Button } from '../buttons/buttons';
import { ScoreDisplay } from './ScoreDisplay';
import { SERVER_URL } from '@/socket/hook';

export const GameCompo = ({
  socket,
  allUsernames,
}: {
  socket: SocketType;
  allUsernames: Record<string, string>;
}) => {
  const [step, setStep] = useState<number>(0);
  const [definitions, setDefinitions] = useState<Definitions>({});
  const [word, setWord] = useState<string>('');
  const [results, setResults] = useState<Results>({});
  const [definitionWritten, setDefinitionWritten] = useState<string>('');
  const [definitionIdChosen, setDefinitionIdChosen] = useState<string>('');
  const [scores, setScores] = useState<Record<string, number>>({});

  const updateState = ({
    step: currentStep,
    word: currentWord,
    definitions: currentDefinitions,
    // players: currentPlayers,
    results: currentResults,
    scores: currentScores,
    myState,
  }: any) => {
    if (myState) {
      const { definitionIdChosen, userId } = myState;
      setDefinitionWritten(currentDefinitions[userId]?.content);
      setDefinitionIdChosen(definitionIdChosen);
    }
    setStep(currentStep);
    setWord(currentWord);
    setDefinitions(currentDefinitions);
    setResults(currentResults);
    setScores(currentScores);
  };

  const eventList = [
    'connection_accepted',
    'game_started',
    'definitions_acquired',
    'definitions_chosen',
    'update_state',
  ];

  useEffect(() => {
    if (socket) {
      eventList.forEach((event) => {
        socket.on(event, updateState);
      });

      return () => {
        eventList.forEach((event) => {
          socket.off(event, updateState);
        });
      };
    }
  }, [socket]);

  const scoresAndNames = Object.entries(scores)
    .map(([userId, score]) => ({
      userId,
      score,
      name: allUsernames[userId],
    }))
    .sort((a, b) => {
      if (a.score > b.score) return -1;
      if (a.score < b.score) return 1;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="flex flex-1">
      <div className="flex flex-col flex-1">
        <div className="ml-6">
          {step === 0 ? (
            <Button
              onClick={() => {
                fetch(SERVER_URL); // To avoid server to be inactive and reset
                socket.emit('start_game');
              }}
            >
              Start Game
            </Button>
          ) : (
            <Button
              onClick={() => {
                fetch(SERVER_URL); // To avoid server to be inactive and reset
                socket.emit('restart_game');
              }}
            >
              Restart
            </Button>
          )}
        </div>

        {step === 1 && (
          <Step1
            socket={socket}
            word={word}
            definitionWritten={definitionWritten}
          />
        )}
        {step === 2 && (
          <Step2
            socket={socket}
            word={word}
            definitions={definitions}
            definitionIdChosen={definitionIdChosen}
          />
        )}
        {step === 3 && <Step3 word={word} results={results} />}
      </div>
      <ScoreDisplay scoresAndNames={scoresAndNames} />
    </div>
  );
};
