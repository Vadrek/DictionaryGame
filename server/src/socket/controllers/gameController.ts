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
    socket.emit("connection_accepted", { username: getRandomUsername() });
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

const randomNames = [
  "Alice",
  "Bob",
  "Charlie",
  "David",
  "Eve",
  "Frank",
  "Grace",
  "Heidi",
  "Ivan",
  "Judy",
  "Mallory",
  "Oscar",
];

function getRandomUsername() {
  const randomNumber = Math.floor(Math.random() * randomNames.length);
  return randomNames[randomNumber];
}
