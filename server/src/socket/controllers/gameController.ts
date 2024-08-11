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
import { getRandomUsername } from "../utils";
import { getWordAndDefinition } from "../../routes";

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

  getState(): {
    allUsernames: string[];
    step: number;
    word: string;
    definitions: Definitions;
    realDefinitionId: string;
    votes: number;
    results: Results;
  } {
    return {
      allUsernames: Object.values(this.players).map(
        (player) => player.username
      ),
      step: this.step,
      word: this.word,
      definitions: this.definitions,
      realDefinitionId: this.realDefinitionId,
      votes: this.votes,
      results: this.results,
    };
  }

  getMyState(socket: SocketType): { myState: Player } {
    return { myState: this.players[socket.userID] };
  }

  @OnConnect()
  public onConnection(@ConnectedSocket() socket: SocketType) {
    const username = socket.username || getRandomUsername();
    this.players[socket.userID] = {
      sessionID: socket.sessionID,
      userId: socket.userID,
      username,
      definitionIdWritten: socket.definitionIdWritten || "",
      definitionIdChosen: socket.definitionIdChosen || "",
    };

    socket.emit("connection_accepted", {
      ...this.getMyState(socket),
      ...this.getState(),
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
    const username = this.players[socket.userID].username;

    const matchingSockets = await io.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      socket.broadcast.emit("user disconnected", socket.userID);
      // update the connection status of the session

      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: username,
        connected: false,
        definitionIdWritten: this.players[socket.userID].definitionIdWritten,
        definitionIdChosen: this.players[socket.userID].definitionIdChosen,
      });
      delete this.players[socket.userID];
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

    socket.broadcast.emit("update_usernames", {
      allUsernames: Object.values(this.players).map(
        (player) => player.username
      ),
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

    Object.values(this.players).forEach((player) => {
      player.definitionIdWritten = "";
      player.definitionIdChosen = "";
    });

    io.emit("game_restarted", this.getState());
  }

  @OnMessage("start_game")
  public async startGame(@SocketIO() io: any) {
    this.step = 1;
    const { word, definition } = await getWordAndDefinition();
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

    io.emit("game_started", this.getState());
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

    if (
      Object.keys(this.definitions).length ===
      Object.keys(this.players).length + 1
    ) {
      this.step = 2;
      Object.keys(this.players).forEach((userId) => {
        const definitionId = this.players[userId].definitionIdWritten;
        this.results[definitionId] = {
          id: definitionId,
          content: this.definitions[userId].content,
          author: this.players[userId],
          isReal: false,
          voters: [],
        };
      });

      io.emit("definitions_acquired", this.getState());
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

      io.emit("definitions_chosen", this.getState());
    }
  }
}
