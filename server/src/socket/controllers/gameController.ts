import {
  ConnectedSocket,
  OnConnect,
  OnDisconnect,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Socket } from "socket.io";

function getRandomWord() {
  const words = [
    "red",
    "blue",
    "green",
    "yellow",
    "black",
    "white",
    "purple",
    "orange",
    "pink",
    "brown",
    "grey",
  ];
  return words[Math.floor(Math.random() * words.length)];
}

@SocketController()
export class GameController {
  public players: Record<string, any>;

  constructor() {
    this.players = {};
  }

  @OnConnect()
  public onConnection(@ConnectedSocket() socket: Socket) {
    this.players[socket.id] = {};
    console.log("hello connect");
    // socket.emit("init_board", this.board);
  }

  @OnDisconnect()
  public onDisconnection(@ConnectedSocket() socket: Socket) {
    delete this.players[socket.id];
  }

  @OnMessage("start_game")
  public startGame(@SocketIO() io: any) {
    io.emit("game_started", { word: getRandomWord() });
  }
}
