import { SocketControllers } from "socket-controllers";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { sessionStore } from "./socket/sessionStore";
import { SocketType } from "./socket/controllers/type";
import { GameController } from "./socket/controllers/gameController";
import { Container } from "typedi";
import { CanvasController } from "./socket/controllers/canvasController";
import { RoomController } from "./socket/controllers/roomController";

export const socketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      // origin: `${process.env.FRONT_URL}/*`,
      // origin: "http://localhost:3000"
      origin: "*",
    },
  });

  io.use((socket: SocketType, next) => {
    const sessionId = socket.handshake.auth.sessionId;

    if (sessionId) {
      // find existing session
      const session = sessionStore.findSession(sessionId);
      if (session) {
        socket.sessionId = sessionId;
        socket.userId = session.userId;
        socket.username = session.username;
        socket.definitionIdWritten = session.definitionIdWritten;
        socket.definitionIdChosen = session.definitionIdChosen;
        socket.score = session.score;
        return next();
      }
    }
    const username = socket.handshake.auth.username;

    // create new session
    socket.sessionId = uuidv4();
    socket.userId = uuidv4();
    socket.username = username;
    socket.score = 0;
    socket.definitionIdWritten = "";
    socket.definitionIdChosen = "";

    next();
  });

  new SocketControllers({
    io,
    container: Container,
    controllers: [GameController, CanvasController, RoomController],
  });

  return io;
};
