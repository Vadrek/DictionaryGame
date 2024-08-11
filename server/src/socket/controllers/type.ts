import { Socket } from "socket.io";

export type PlayerCanvas = {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
};

export type Player = {
  sessionID: string;
  userId: string;
  username: string;
  definitionIdWritten: string;
  definitionIdChosen: string;
};

export type SocketType = Socket & {
  userID: string;
  username: string;
  sessionID: string;
  definitionIdWritten: string;
  definitionIdChosen: string;
};

export type Definition = {
  id: string;
  content: string;
};

export type Definitions = Record<string, Definition>; // key = userID

export type Result = {
  id: string;
  content: string;
  author: Player | null;
  isReal: boolean;
  voters: Player[];
};

export type Results = Record<string, Result>;
