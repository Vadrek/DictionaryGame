"use client";
import React, { useEffect, useState } from "react";
import { Button } from "antd";

import styles from "./GameCompo.module.css";
import { Step0 } from "./Step0";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { Player } from "./game.types";

export const GameCompo = ({ socket }: any) => {
  const [step, setStep] = useState<number>(0);
  const [definitions, setDefinitions] = useState<string>("");
  const [word, setWord] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);

  const updateState = ({
    step: currentStep,
    word: currentWord,
    definitions: currentDefinitions,
    players: currentPlayers,
  }: any) => {
    setStep(currentStep);
    setWord(currentWord);
    setDefinitions(currentDefinitions);
    setPlayers(currentPlayers);
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
    <div className={styles.main_div}>
      {step > 0 && (
        <Button
          onClick={() => {
            socket.emit("restart_game");
          }}
        >
          Restart
        </Button>
      )}
      {step === 0 && <Step0 socket={socket} />}
      {step === 1 && <Step1 socket={socket} word={word} />}
      {step === 2 && <Step2 socket={socket} definitions={definitions} />}
      {step === 3 && <Step3 players={players} />}
    </div>
  );
};
