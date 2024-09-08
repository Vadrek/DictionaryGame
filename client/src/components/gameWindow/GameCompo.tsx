"use client";
import React, { useEffect, useState } from "react";
import { Button } from "antd";

import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { Definitions, Results, SocketType } from "./game.types";

import styles from "./GameCompo.module.scss";

export const GameCompo = ({
  socket,
  allUsernames,
}: {
  socket: SocketType;
  allUsernames: Record<string, string>;
}) => {
  const [step, setStep] = useState<number>(0);
  const [definitions, setDefinitions] = useState<Definitions>({});
  const [word, setWord] = useState<string>("");
  const [results, setResults] = useState<Results>({});
  const [definitionWritten, setDefinitionWritten] = useState<string>("");
  const [definitionIdChosen, setDefinitionIdChosen] = useState<string>("");
  const [scores, setScores] = useState<Record<string, number>>({});

  const updateState = ({
    step: currentStep,
    word: currentWord,
    definitions: currentDefinitions,
    players: currentPlayers,
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

  useEffect(() => {
    if (socket) {
      socket.on("connection_accepted", updateState);
      socket.on("game_restarted", updateState);
      socket.on("game_started", updateState);
      socket.on("definitions_acquired", updateState);
      socket.on("definitions_chosen", updateState);

      return () => {
        socket.off("connection_accepted", updateState);
        socket.off("game_restarted", updateState);
        socket.off("game_started", updateState);
        socket.off("definitions_acquired", updateState);
        socket.off("definitions_chosen", updateState);
      };
    }
  }, [socket]);

  return (
    <div className={styles.mainDiv}>
      <div className={styles.topDiv}>
        {step === 0 ? (
          <Button
            onClick={() => {
              socket.emit("start_game");
            }}
          >
            Start Game
          </Button>
        ) : (
          <Button
            onClick={() => {
              socket.emit("restart_game");
            }}
          >
            Restart
          </Button>
        )}
        <div className={styles.scoresDiv}>
          <h2>Scores</h2>
          {Object.keys(scores).map((userId) => (
            <div>
              {allUsernames[userId]}: {scores[userId]}
            </div>
          ))}
        </div>
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
  );
};
