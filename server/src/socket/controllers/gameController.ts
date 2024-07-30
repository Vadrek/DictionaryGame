import {
  ConnectedSocket,
  MessageBody,
  OnConnect,
  OnDisconnect,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { v4 as uuidv4 } from "uuid";

import { sessionStore } from "../sessionStore";
import { Definition, Definitions, Player, Results, SocketType } from "./type";
import { getRandomUsername, getRandomWord } from "../utils";
import { getDefinitionFromNum, getRandomDictNumber } from "../../routes";

@SocketController()
export class GameController {
  public players: Record<string, Player>;
  public step: number;
  public word: string;
  public definitions: Definitions;
  public realDefinitionId: string;
  public votes: number;
  public results: Results;

  constructor() {
    this.players = {};
    this.step = 0;
    this.word = "";
    this.definitions = {};
    this.realDefinitionId = "";
    this.votes = 0;
    this.results = {};
  }

  @OnConnect()
  public onConnection(@ConnectedSocket() socket: SocketType) {
    const username = socket.username || getRandomUsername();
    this.players[socket.userID] = {
      sessionID: socket.sessionID,
      userId: socket.userID,
      username,
      definitionIdWritten: "",
      definitionIdChosen: "",
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
      players: this.players,
      results: this.results,
    });

    socket.emit("store_session", {
      sessionID: socket.sessionID,
      userID: socket.userID,
      username,
    });
    console.log("connect this.players", this.players);
  }

  @OnDisconnect()
  public async onDisconnection(
    @ConnectedSocket()
    socket: SocketType,
    @SocketIO() io: any
  ) {
    const username = this.players[socket.userID].username;

    const matchingSockets = await io.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      delete this.players[socket.userID];
      // notify other users
      socket.broadcast.emit("user disconnected", socket.userID);
      // update the connection status of the session

      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: username,
        connected: false,
      });
    }
  }

  @OnMessage("change_username")
  public changeUsername(
    @ConnectedSocket() socket: SocketType,
    @SocketIO() io: any,
    @MessageBody()
    body: { username: string }
  ) {
    const oldUsername = this.players[socket.userID].username;
    this.players[socket.userID].username = body.username;
    const allUsernames = Object.values(this.players).map(
      (player) => player.username
    );

    socket.emit("connection_accepted", {
      username: body.username,
      allUsernames,
      step: this.step,
      word: this.word,
      definitions: this.definitions,
      players: this.players,
      results: this.results,
    });

    socket.broadcast.emit("update_usernames", {
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
    this.definitions = {};
    this.results = {};
    this.realDefinitionId = "";
    this.players = {};

    Object.values(this.players).forEach((player) => {
      player.definitionIdWritten = "";
      player.definitionIdChosen = "";
    });

    io.emit("game_restarted", {
      step: this.step,
      word: this.word,
      definitions: this.definitions,
    });
  }

  @OnMessage("start_game")
  public async startGame(@SocketIO() io: any) {
    this.step = 1;
    // this.word = getRandomWord();
    // const realDefinition = "the real definition";
    // const num = 80000;
    const num = getRandomDictNumber();
    const { word, definition } = await getDefinitionFromNum(num);
    // console.log("hey word, definition", word, definition, num);
    this.word = word;
    const realDefinition = definition;
    const realDefinitionId = uuidv4();
    this.realDefinitionId = realDefinitionId;
    this.definitions = {
      [realDefinitionId]: {
        id: realDefinitionId,
        content: realDefinition,
      },
    };

    this.results[realDefinitionId] = {
      id: realDefinitionId,
      content: realDefinition,
      author: null,
      isReal: true,
      voters: [],
    };

    io.emit("game_started", { step: this.step, word: this.word });
  }

  @OnMessage("write_definition")
  public storeDefinition(
    @ConnectedSocket() socket: SocketType,
    @SocketIO() io: any,
    @MessageBody()
    body: { definitionContent: string }
  ) {
    const definitionId = uuidv4();
    this.players[socket.userID].definitionIdWritten = definitionId;
    this.definitions[socket.userID] = {
      id: definitionId,
      content: body.definitionContent,
    };

    this.results[definitionId] = {
      id: definitionId,
      content: body.definitionContent,
      author: this.players[socket.userID],
      isReal: false,
      voters: [],
    };

    if (
      Object.keys(this.definitions).length ===
      Object.keys(this.players).length + 1
    ) {
      this.step = 2;

      io.emit("definitions_acquired", {
        step: this.step,
        definitions: this.definitions,
      });
    }
  }

  @OnMessage("choose_definition")
  public chooseDefinition(
    @ConnectedSocket() socket: SocketType,
    @SocketIO() io: any,
    @MessageBody()
    body: { definition: Definition }
  ) {
    this.players[socket.userID].definitionIdChosen = body.definition.id;
    this.results[body.definition.id].voters.push(this.players[socket.userID]);

    this.votes = Object.values(this.players).reduce((acc, player) => {
      if (player.definitionIdChosen) {
        return acc + 1;
      }
    }, 0);
    if (this.votes === Object.keys(this.players).length) {
      this.step = 3;

      io.emit("definitions_chosen", {
        step: this.step,
        results: this.results,
      });
    }
  }
}
