// @typescript-eslint/no-unused-vars
import { useState } from "react";
import styled from "styled-components";
import "./App.css";
// import { JoinRoom } from "./components/joinRoom";
import GameContext, { IGameContextProps } from "./gameContext";
// import { Game } from "./components/oldGame";
// import socketService from "./services/socketService";
// import BounceBall from "./components/oldGame/bounceBall";
import { Canvas } from "./components/game/canvas";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
`;

const WelcomeText = styled.h1`
  margin: 0;
  color: #8e44ad;
`;

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function App() {
  const [isInRoom, setInRoom] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState<"x" | "o">("x");
  const [isPlayerTurn, setPlayerTurn] = useState(false);
  const [isGameStarted, setGameStarted] = useState(false);

  //   const connectSocket = async () => {
  //     const socket = await socketService
  //       .connect("http://localhost:9000")
  //       .catch((err) => {
  //         console.log("Error: ", err);
  //       });
  //   };

  // useEffect(() => {
  //     console.log("USE EFFECT CONNECT SOCKET");
  //     connectSocket();
  //     if (socketService.socket) {
  //         console.log("IN APP SOCKET SERVICE");
  //     }
  // }, []);

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
      <AppContainer>
        <WelcomeText>{welcomeText}</WelcomeText>
        <MainContainer>
          {/* {!isInRoom && <JoinRoom />}
          {isInRoom && <Game />} */}
          {/* <BounceBall /> */}
          <Canvas />
        </MainContainer>
      </AppContainer>
    </GameContext.Provider>
  );
}

export default App;
