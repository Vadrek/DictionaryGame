export type Player = {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
};

export type Square = {
  color: string;
  time: string;
};

export type BoardUpdate = { players: Player[]; board: Square[][] };
