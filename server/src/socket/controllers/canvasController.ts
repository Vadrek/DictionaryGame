import {
  ConnectedSocket,
  MessageBody,
  OnConnect,
  OnDisconnect,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Socket } from "socket.io";

import { EMPTY_SQUARE, initBoard } from "../canvasGameLogic/board";
import {
  BOARD_NB_COLS,
  BOARD_NB_ROWS,
  COLOR_DURATION,
  PIXEL_BY_SQUARE,
  PLAYER_SIZE,
  PLAYER_SPEED,
} from "../canvasGameLogic/constants";
import { Square } from "../canvasGameLogic/type";
import { PlayerCanvas } from "./type";
import { Service } from "typedi";

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

@Service()
@SocketController()
export class CanvasController {
  public players: Record<string, PlayerCanvas>;
  public board: Square[][];
  public pixel: number;
  public xMax: number;
  public yMax: number;

  constructor() {
    this.players = {};
    this.board = initBoard(BOARD_NB_ROWS, BOARD_NB_COLS);
    this.xMax = this.board[0].length * PIXEL_BY_SQUARE;
    this.yMax = this.board.length * PIXEL_BY_SQUARE;
  }

  @OnConnect()
  public onConnection(@ConnectedSocket() socket: Socket) {
    this.players[socket.id] = {
      x: Math.floor(Math.random() * this.xMax),
      y: Math.floor(Math.random() * this.yMax),
      size: PLAYER_SIZE,
      speed: PLAYER_SPEED,
      color: getRandomColor(),
    };
    socket.emit("init_board", this.board);

    setInterval(() => {
      this.clearOldColors();
      socket.emit("update_board", {
        players: Object.values(this.players),
        board: this.board,
      });
    }, 1000 / 60);
  }

  @OnDisconnect()
  public onDisconnection(@ConnectedSocket() socket: Socket) {
    delete this.players[socket.id];
  }

  @OnMessage("move_player")
  public movePlayer(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    body: { direction: string }
  ) {
    this.moveOnePlayer(body.direction, this.players[socket.id]);
    this.colorPlayerSquare(this.players[socket.id]);
  }

  public moveOnePlayer(direction: string, player: PlayerCanvas) {
    if (direction == "UP") player.y -= player.speed;
    if (direction == "DOWN") player.y += player.speed;
    if (direction == "LEFT") player.x -= player.speed;
    if (direction == "RIGHT") player.x += player.speed;

    const borderSize = player.size / 2;
    if (player.y - borderSize <= 0) player.y = borderSize;
    if (player.y + borderSize >= this.yMax) player.y = this.yMax - borderSize;
    if (player.x - borderSize <= 0) player.x = borderSize;
    if (player.x + borderSize >= this.xMax) player.x = this.xMax - borderSize;
  }

  public clearOldColors() {
    const now = new Date();
    for (let r = 0; r < this.board.length; r++) {
      for (let c = 0; c < this.board[0].length; c++) {
        const square = this.board[r][c];
        if (square.time) {
          const colorExpireDate = new Date(
            new Date(square.time).getTime() + COLOR_DURATION * 1000
          );
          if (now > colorExpireDate) {
            this.board[r][c] = EMPTY_SQUARE;
          }
        }
      }
    }
  }

  public colorPlayerSquare(player: PlayerCanvas) {
    const playerRow = Math.floor(player.y / PIXEL_BY_SQUARE);
    const playerCol = Math.floor(player.x / PIXEL_BY_SQUARE);
    this.board[playerRow][playerCol] = {
      color: player.color,
      time: new Date().toISOString(),
    };
  }
}
