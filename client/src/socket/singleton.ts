import { DefaultEventsMap } from "@socket.io/component-emitter";

import { Socket, io } from "socket.io-client";

let socket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null;

export const getSocket = () => {
  if (!socket) {
    console.log("CREATE socket");
    const server_url =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";
    socket = io(server_url);
  }

  return socket;
};
