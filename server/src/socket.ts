import { useSocketServer } from "socket-controllers";
import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { sessionStore } from "./socket/sessionStore";
import { SocketType } from "./socket/controllers/type";

export const socketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      // origin: `${process.env.FRONT_URL}/*`,
      // origin: "http://localhost:3000"
      origin: "*",
    },
  });

  io.use((socket: SocketType, next) => {
    const sessionID = socket.handshake.auth.sessionID;
    console.log("dino sessionID", sessionID);

    if (sessionID) {
      // find existing session
      const session = sessionStore.findSession(sessionID);
      if (session) {
        console.log("session.username", session.username);
        socket.sessionID = sessionID;
        socket.userID = session.userID;
        socket.username = session.username;
        return next();
      }
    }
    const username = socket.handshake.auth.username;
    console.log("hey username", username);

    // create new session
    socket.sessionID = uuidv4();
    socket.userID = uuidv4();
    socket.username = username;

    next();
  });

  useSocketServer(io, {
    controllers: [__dirname + "/socket/controllers/*.ts"],
  });

  return io;
};
