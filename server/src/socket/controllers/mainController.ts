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

import { EMPTY_SQUARE, initBoard } from "../gameLogic/board";
import {
  BOARD_NB_COLS,
  BOARD_NB_ROWS,
  COLOR_DURATION,
  PIXEL_BY_SQUARE,
  PLAYER_SIZE,
  PLAYER_SPEED,
} from "../gameLogic/constants";
import { Square } from "../gameLogic/type";
import { Player } from "./type";

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

@SocketController()
export class MainController {
  public players: Record<string, Player>;
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
    console.log(
      "New Socket connected: ",
      socket.id,
      "length",
      Object.keys(this.players).length
    );

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

    socket.on("custom_event", (data: any) => {
      console.log("Data: ", data);
    });
  }

  @OnDisconnect()
  public onDisconnection(@ConnectedSocket() socket: Socket) {
    delete this.players[socket.id];
    console.log(
      "Socket disconnected: ",
      socket.id,
      "length",
      Object.keys(this.players).length
    );
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

  public moveOnePlayer(direction: string, player: Player) {
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

  public colorPlayerSquare(player: Player) {
    const playerRow = Math.floor(player.y / PIXEL_BY_SQUARE);
    const playerCol = Math.floor(player.x / PIXEL_BY_SQUARE);
    this.board[playerRow][playerCol] = {
      color: player.color,
      time: new Date().toISOString(),
    };
  }

  @OnMessage("send_msg")
  public answerChat(
    @SocketIO() io: any,
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any
  ) {
    console.log("answerChat");
    // socket.emit("receive_msg", data);
    io.emit("receive_msg", data); // broadcast to all
  }
}
