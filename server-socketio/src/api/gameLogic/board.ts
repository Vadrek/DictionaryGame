import { TRANSPARENT_COLOR } from "./constants";
import { Square } from "./type";

export function initBoard(nbRows: number, nbColumns: number): Square[][] {
  const board: Square[][] = [];
  for (let i = 0; i < nbRows; i++) {
    const row: Square[] = [];
    for (let j = 0; j < nbColumns; j++) {
      row.push(EMPTY_SQUARE);
    }
    board.push(row);
  }
  return board;
}

export const EMPTY_SQUARE = {
  color: TRANSPARENT_COLOR,
  time: "",
};
