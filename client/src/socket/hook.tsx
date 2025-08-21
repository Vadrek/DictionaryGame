import { SocketType } from '@/components/gameWindow/game.types';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export const SERVER_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';

export function useSocket() {
  const [socket, setSocket] = useState<SocketType | null>(null);

  useEffect(() => {
    const socketIo = io(SERVER_URL);

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return socket;
}
