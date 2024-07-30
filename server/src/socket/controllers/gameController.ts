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
import { sessionStore } from "../sessionStore";
import { SocketType } from "./type";

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

type Player = {
  sessionID: string;
  userId: string;
  username: string;
  definitionWritten: string;
  definitionChosen: string;
};

@SocketController()
export class GameController {
  public players: Record<string, Player>;
  public step: number;
  public word: string;
  public realDefinition: string;
  public definitions: string[] = [];
  public votes: number;

  constructor() {
    this.players = {};
    this.step = 0;
    this.word = "";
    this.realDefinition = "";
    this.definitions = [];
    this.votes = 0;
  }

  @OnConnect()
  public onConnection(@ConnectedSocket() socket: SocketType) {
    const username = socket.username || getRandomUsername();
    this.players[socket.id] = {
      sessionID: "",
      userId: socket.id,
      username,
      definitionWritten: "",
      definitionChosen: "",
    };

    const allUsernames = Object.values(this.players).map(
      (player) => player.username
    );
    socket.emit("connection_accepted", {
      username,
      allUsernames,
      step: this.step,
      word: this.word,
      definitions: this.definitions,
    });

    socket.emit("store_session", {
      sessionID: socket.sessionID,
      userID: socket.userID,
      username,
    });
  }

  @OnDisconnect()
  public async onDisconnection(
    @ConnectedSocket()
    socket: SocketType,
    @SocketIO() io: any
  ) {
    const username = this.players[socket.id].username;
    delete this.players[socket.id];

    const matchingSockets = await io.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      socket.broadcast.emit("user disconnected", socket.userID);
      // update the connection status of the session
      console.log("saveSession", socket.sessionID);
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: username,
        connected: false,
      });
    }
  }

  @OnMessage("change_username")
  public changeUsername(
    @ConnectedSocket() socket: Socket,
    @SocketIO() io: any,
    @MessageBody()
    body: { username: string }
  ) {
    const oldUsername = this.players[socket.id].username;
    this.players[socket.id].username = body.username;
    const allUsernames = Object.values(this.players).map(
      (player) => player.username
    );

    socket.emit("connection_accepted", {
      username: body.username,
      allUsernames,
      step: this.step,
      word: this.word,
      definitions: this.definitions,
    });

    io.emit("update_usernames", {
      allUsernames,
    });

    io.emit("receive_msg", {
      user: "",
      msg: `"${oldUsername}" changed his username to "${body.username}"`,
    });
  }

  @OnMessage("send_msg")
  public answerChat(@SocketIO() io: any, @MessageBody() data: any) {
    io.emit("receive_msg", data); // broadcast to all
  }

  @OnMessage("restart_game")
  public restartGame(@SocketIO() io: any) {
    this.step = 0;
    this.word = "";
    this.definitions = [];
    Object.values(this.players).forEach((player) => {
      player.definitionWritten = "";
      player.definitionChosen = "";
    });

    io.emit("game_restarted", {
      step: this.step,
      word: this.word,
      definitions: this.definitions,
    });
  }

  @OnMessage("start_game")
  public startGame(@SocketIO() io: any) {
    this.step = 1;
    this.word = getRandomWord();
    this.realDefinition = "the real definition";
    io.emit("game_started", { step: this.step, word: this.word });
  }

  @OnMessage("write_definition")
  public storeDefinition(
    @ConnectedSocket() socket: Socket,
    @SocketIO() io: any,
    @MessageBody()
    body: { definition: string }
  ) {
    this.players[socket.id].definitionWritten = body.definition;
    const playersDefinitions = Object.values(this.players)
      .map((player) => player.definitionWritten)
      .filter((def) => def);

    this.definitions = [...playersDefinitions, this.realDefinition].sort();
    if (this.definitions.length === Object.keys(this.players).length + 1) {
      this.step = 2;
      io.emit("definitions_acquired", {
        step: this.step,
        definitions: this.definitions,
      });
    }
  }

  @OnMessage("choose_definition")
  public chooseDefinition(
    @ConnectedSocket() socket: Socket,
    @SocketIO() io: any,
    @MessageBody()
    body: { definition: string }
  ) {
    this.players[socket.id].definitionChosen = body.definition;
    this.votes = Object.values(this.players).reduce((acc, player) => {
      if (player.definitionChosen) {
        return acc + 1;
      }
    }, 0);
    if (this.votes === Object.keys(this.players).length) {
      this.step = 3;

      const result = {};
      Object.keys(this.players).forEach((id) => {
        result[id] = {};
      });

      for (const [id, player] of Object.entries(this.players)) {
        result[id] = {};
      }

      io.emit("definitions_chosen", {
        step: this.step,
        players: Object.values(this.players),
      });
    }
  }
}
