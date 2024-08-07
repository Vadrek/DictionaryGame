import { SocketType } from "@/components/gameWindow/game.types";
import { useEffect, useState } from "react";
import io from "socket.io-client";

export function useSocket() {
  const [socket, setSocket] = useState<SocketType | null>(null);
  const server_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

  useEffect(() => {
    const socketIo = io(server_url);

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return socket;
}
