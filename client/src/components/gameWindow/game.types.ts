import { Socket } from "socket.io-client";

export type Player = {
  sessionID: string;
  userId: string;
  username: string;
  definitionIdWritten: string;
  definitionIdChosen: string;
};

export type SocketType = Socket & {
  userID?: string;
  username?: string;
  sessionID?: string;
};

export type Definition = {
  id: string;
  content: string;
  isReal?: boolean;
};

export type Definitions = Record<string, Definition>;

export type Result = {
  id: string;
  content: string;
  author: Player | null;
  isReal: boolean;
  voters: Player[];
};

export type Results = Record<string, Result>;
