import React from 'react';

import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';

import { Button } from '../buttons/buttons';
import { ScoreDisplay } from './ScoreDisplay';
import { SERVER_URL } from '@/socket/hook';
import { useGame } from '@/app/GameContext';

export const GameCompo = () => {
  const {
    step,
    word,
    definitions,
    results,
    definitionWritten,
    definitionIdChosen,
    socket,
  } = useGame();

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

        <div className="flex flex-1 flex-col min-h-0 overflow-y-auto items-center gap-6 p-6 ml-6 mr-6 mt-6 bg-gradient-to-b from-purple-900 to-black rounded-lg shadow-lg">
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
      </div>
      <ScoreDisplay />
    </div>
  );
};
