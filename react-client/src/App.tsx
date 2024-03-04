import { useState } from "react";
import { Canvas } from "./components/game/canvas";
import GameContext, { IGameContextProps } from "./gameContext";

import styles from "./App.module.css";

function App() {
  const [isInRoom, setInRoom] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState<"x" | "o">("x");
  const [isPlayerTurn, setPlayerTurn] = useState(false);
  const [isGameStarted, setGameStarted] = useState(false);

  const gameContextValue: IGameContextProps = {
    isInRoom,
    setInRoom,
    playerSymbol,
    setPlayerSymbol,
    isPlayerTurn,
    setPlayerTurn,
    isGameStarted,
    setGameStarted,
  };
  const welcomeText = "Welcome :)";

  return (
    <GameContext.Provider value={gameContextValue}>
      <div className={styles.appContainer}>
        <h1 className={styles.welcomeText}>{welcomeText}</h1>
        <div className={styles.mainContainer}>
          {/* {!isInRoom && <JoinRoom />}
          {isInRoom && <Game />} */}
          <Canvas />
        </div>
      </div>
    </GameContext.Provider>
  );
}

export default App;
