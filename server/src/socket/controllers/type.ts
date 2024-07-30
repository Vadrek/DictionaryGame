import { Socket } from "socket.io";

export type Player = {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
};

export type SocketType = Socket & {
  userID: string;
  username: string;
  sessionID: string;
};
