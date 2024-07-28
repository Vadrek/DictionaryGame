import { useEffect, useState } from "react";
import io from "socket.io-client";

export function useSocket() {
  const [socket, setSocket] = useState<any>(null);
  const server_url = process.env.REACT_APP_API_URL || "http://localhost:9000";

  useEffect(() => {
    const socketIo = io(server_url);
    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return socket;
}
