import { useSocketServer } from "socket-controllers";
import { Server } from "socket.io";

export const socketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      // origin: `${process.env.FRONT_URL}/*`,
      // origin: "http://localhost:3000"
      origin: "*",
    },
  });

  useSocketServer(io, {
    controllers: [__dirname + "/socket/controllers/*.ts"],
  });

  return io;
};
