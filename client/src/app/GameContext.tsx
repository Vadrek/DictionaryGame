import { Definitions, Results } from '@/components/gameWindow/game.types';
import { useSocket } from '@/socket/hook';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface GameContextType {
  step: number;
  word: string;
  definitions: Definitions;
  scores: Record<string, number>;
  setStep: (s: number) => void;
  results: Results;
  definitionWritten: string;
  definitionIdChosen: string;
  inputUsername: string;
  setInputUsername: (username: string) => void;
  currentUsername: string;
  setCurrentUsername: (username: string) => void;
  allUsernames: Record<string, string>;
  socket: any;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [inputUsername, setInputUsername] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [allUsernames, setAllUsernames] = useState<Record<string, string>>({});

  const [step, setStep] = useState<number>(0);
  const [definitions, setDefinitions] = useState<Definitions>({});
  const [word, setWord] = useState<string>('');
  const [results, setResults] = useState<Results>({});
  const [definitionWritten, setDefinitionWritten] = useState<string>('');
  const [definitionIdChosen, setDefinitionIdChosen] = useState<string>('');
  const [scores, setScores] = useState<Record<string, number>>({});

  const socket = useSocket();

  const onConnectionAccepted = ({ myState }: any) => {
    const username = myState.username;
    setInputUsername(username);
    setCurrentUsername(username);
  };

  const onUpdateUsernames = ({ allUsernames }: any) => {
    setAllUsernames(allUsernames);
  };

  const onStoreSession = ({ sessionId, userId, username, score }: any) => {
    if (!socket) return;
    // attach the session ID to the next reconnection attempts
    socket.auth = { sessionId, username, score };
    // store it in the localStorage
    sessionStorage.setItem('sessionId', sessionId);
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('score', score);
    // save the ID of the user
    socket.userId = userId;
    socket.username = username;
    socket.score = score;
  };

  const onResetSockets = () => {
    const url = new URL(window.location.href);
    url.pathname = '/logout';
    window.location.replace(url.toString());
  };

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

  const gameEventList = [
    'connection_accepted',
    'game_started',
    'definitions_acquired',
    'definitions_chosen',
    'update_state',
  ];

  useEffect(() => {
    if (socket) {
      const sessionId = sessionStorage.getItem('sessionId');
      const username = sessionStorage.getItem('username');
      const score = sessionStorage.getItem('score');
      socket.auth = { sessionId, username, score };
      socket.on('connection_accepted', onConnectionAccepted);
      socket.on('update_usernames', onUpdateUsernames);
      socket.on('store_session', onStoreSession);
      socket.on('reset_sockets', onResetSockets);

      gameEventList.forEach((event) => {
        socket.on(event, updateState);
      });

      return () => {
        socket.off('connection_accepted', onConnectionAccepted);
        socket.off('update_usernames', onUpdateUsernames);
        socket.off('store_session', onStoreSession);
        socket.off('reset_sockets', onResetSockets);

        gameEventList.forEach((event) => {
          socket.off(event, updateState);
        });
      };
    }
  }, [socket]);

  return (
    <GameContext.Provider
      value={{
        inputUsername,
        setInputUsername,
        currentUsername,
        setCurrentUsername,
        allUsernames,
        step,
        word,
        definitions,
        scores,
        setStep,
        socket,
        results,
        definitionWritten,
        definitionIdChosen,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within a GameProvider');
  return ctx;
};
