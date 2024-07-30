"use client";
import React, { useEffect, useState } from "react";
import { Button } from "antd";

import styles from "./GameCompo.module.css";
import { Step0 } from "./Step0";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { Definitions, Player, Results } from "./game.types";

export const GameCompo = ({ socket }: any) => {
  const [step, setStep] = useState<number>(0);
  const [definitions, setDefinitions] = useState<Definitions>({});
  const [word, setWord] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [results, setResults] = useState<Results>({});

  const updateState = ({
    step: currentStep,
    word: currentWord,
    definitions: currentDefinitions,
    players: currentPlayers,
    results: currentResults,
  }: any) => {
    setStep(currentStep);
    setWord(currentWord);
    setDefinitions(currentDefinitions);
    setPlayers(currentPlayers);
    setResults(currentResults);
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

  const fakeResults = {
    "b9bcd1df-819f-4df2-8ac9-b356ae925be3": {
      id: "b9bcd1df-819f-4df2-8ac9-b356ae925be3",
      content: "the real definition",
      author: null,
      isReal: true,
      voters: [
        {
          sessionID: "bec26bfc-7aa4-4ea3-b735-2a023796fd0e",
          userId: "0d9e9398-2127-43e4-9680-0265e5b77b93",
          username: "Grace",
          definitionIdWritten: "72742ef4-9bb3-4ade-aaae-e5ca25f06f15",
          definitionIdChosen: "b9bcd1df-819f-4df2-8ac9-b356ae925be3",
        },
      ],
    },
    "24de28d3-3d8e-44ae-a9cd-2daa70c5d9e0": {
      id: "24de28d3-3d8e-44ae-a9cd-2daa70c5d9e0",
      content: "aze",
      author: {
        sessionID: "10bb8774-f5af-4281-a21f-b7e0de82cdfb",
        userId: "210a9736-80b3-4a81-9c70-be651b17ca65",
        username: "Bob",
        definitionIdWritten: "24de28d3-3d8e-44ae-a9cd-2daa70c5d9e0",
        definitionIdChosen: "24de28d3-3d8e-44ae-a9cd-2daa70c5d9e0",
      },
      isReal: false,
      voters: [
        {
          sessionID: "10bb8774-f5af-4281-a21f-b7e0de82cdfb",
          userId: "210a9736-80b3-4a81-9c70-be651b17ca65",
          username: "Bob",
          definitionIdWritten: "24de28d3-3d8e-44ae-a9cd-2daa70c5d9e0",
          definitionIdChosen: "24de28d3-3d8e-44ae-a9cd-2daa70c5d9e0",
        },
      ],
    },
    "72742ef4-9bb3-4ade-aaae-e5ca25f06f15": {
      id: "72742ef4-9bb3-4ade-aaae-e5ca25f06f15",
      content: "rez",
      author: {
        sessionID: "bec26bfc-7aa4-4ea3-b735-2a023796fd0e",
        userId: "0d9e9398-2127-43e4-9680-0265e5b77b93",
        username: "Grace",
        definitionIdWritten: "72742ef4-9bb3-4ade-aaae-e5ca25f06f15",
        definitionIdChosen: "b9bcd1df-819f-4df2-8ac9-b356ae925be3",
      },
      isReal: false,
      voters: [],
    },
  };
  return <Step3 results={fakeResults} />;
  // return (
  //   <div className={styles.main_div}>
  //     {step > 0 && (
  //       <Button
  //         onClick={() => {
  //           socket.emit("restart_game");
  //         }}
  //       >
  //         Restart
  //       </Button>
  //     )}
  //     {step === 0 && <Step0 socket={socket} />}
  //     {step === 1 && <Step1 socket={socket} word={word} />}
  //     {step === 2 && <Step2 socket={socket} definitions={definitions} />}
  //     {step === 3 && <Step3 players={players} results={results} />}
  //   </div>
  // );
};
