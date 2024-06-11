import { DefaultEventsMap } from "@socket.io/component-emitter";

import { Socket } from "socket.io-client";

import { useEffect } from "react";
import { socket } from "./socketIo";

export function useSocket(): Socket<DefaultEventsMap, DefaultEventsMap> {
  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log("onConnect");
    }

    function onDisconnect() {
      console.log("onDisconnect");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return socket;
}
