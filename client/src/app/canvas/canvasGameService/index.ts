import { Socket } from "socket.io-client";
import { Player, Square, BoardUpdate } from "./type";

class CanvasGameService {
  public onInitBoard(socket: Socket, listener: (board: Square[][]) => void) {
    socket.on("init_board", (board: Square[][]) => {
      listener(board);
    });
  }

  public movePlayer(socket: Socket, message: { direction: string }) {
    socket.emit("move_player", message);
  }

  public onUpdatePlayers(
    socket: Socket,
    listener: (players: Player[]) => void
  ) {
    socket.on("update_players", (players) => {
      listener(players);
    });
  }

  public onUpdateBoard(socket: Socket, listener: (data: BoardUpdate) => void) {
    socket.on("update_board", (data: BoardUpdate) => {
      listener(data);
    });
  }
}

export const canvasGameService = new CanvasGameService();
