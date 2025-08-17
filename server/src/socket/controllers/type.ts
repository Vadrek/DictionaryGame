import { Socket } from 'socket.io';

export type PlayerCanvas = {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
};

export type Player = {
  sessionId: string;
  userId: string;
  username: string;
  score: number;
  definitionIdWritten: string;
  definitionIdChosen: string;
};

export type SocketType = Socket & Player;

export type Definition = {
  id: string;
  content: string;
};

export type Definitions = Record<string, Definition>; // key = userId

export type Result = {
  id: string;
  content: string;
  author: Player | null;
  isReal: boolean;
  voters: Player[];
};

export type Results = Record<string, Result>;
