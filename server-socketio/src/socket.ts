import { useSocketServer } from "socket-controllers";
import { Server } from "socket.io";

export const socketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  useSocketServer(io, {
    controllers: [__dirname + "/socket/controllers/*.ts"],
  });

  return io;
};
