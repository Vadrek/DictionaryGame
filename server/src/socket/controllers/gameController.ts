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
import { Service } from "typedi";

const SCORE_GUESS_RIGHT = 3;
const SCORE_GET_VOTE = 1;

@Service()
@SocketController()
export class GameController {
  public players: Record<string, Player>;
  public step: number;
  public word: string;
  public definitions: Definitions;
  public realDefinitionId: string;
  public nbVotes: number;
  public results: Results;

  constructor() {
    this.players = {};
    this.step = 0;
    this.word = "";
    this.definitions = {};
    this.realDefinitionId = "";
    this.nbVotes = 0;
    this.results = {};
  }

  getState(): {
    step: number;
    word: string;
    definitions: Definitions;
    realDefinitionId: string;
    votes: number;
    results: Results;
    scores: Record<string, number>;
  } {
    return {
      step: this.step,
      word: this.word,
      definitions: this.definitions,
      realDefinitionId: this.realDefinitionId,
      votes: this.nbVotes,
      results: this.results,
      scores: Object.keys(this.players).reduce(
        (acc, userId) => ({ ...acc, [userId]: this.players[userId].score }),
        {}
      ),
    };
  }

  getMyState(socket: SocketType): { myState: Player } {
    return { myState: this.players[socket.userId] };
  }

  @OnConnect()
  public onConnection(
    @ConnectedSocket() socket: SocketType,
    @SocketIO() io: any
  ) {
    const username = socket.username || getRandomUsername();
    this.players[socket.userId] = {
      sessionId: socket.sessionId,
      userId: socket.userId,
      username,
      score: socket.score || 0,
      definitionIdWritten: socket.definitionIdWritten || "",
      definitionIdChosen: socket.definitionIdChosen || "",
    };

    socket.emit("connection_accepted", {
      ...this.getMyState(socket),
      ...this.getState(),
    });

    socket.emit("store_session", {
      sessionId: socket.sessionId,
      userId: socket.userId,
      username,
      score: socket.score,
    });

    io.emit("update_usernames", {
      allUsernames: Object.values(this.players).reduce((acc, player) => {
        return { ...acc, [player.userId]: player.username };
      }, {}),
    });

    socket.broadcast.emit("update_state", {
      ...this.getState(),
    });

    socket.broadcast.emit("receive_msg", {
      user: "",
      msg: `"${username}" s'est connecté !`,
    });
  }

  @OnDisconnect()
  public async onDisconnection(
    @ConnectedSocket()
    socket: SocketType,
    @SocketIO() io: any
  ) {
    const username = this.players[socket.userId].username;

    const matchingSockets = await io.in(socket.userId).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      socket.broadcast.emit("receive_msg", {
        user: "",
        msg: `"${username}" s'est déconnecté`,
      });

      sessionStore.saveSession(socket.sessionId, {
        userId: socket.userId,
        username: username,
        connected: false,
        score: this.players[socket.userId].score,
        definitionIdWritten: this.players[socket.userId].definitionIdWritten,
        definitionIdChosen: this.players[socket.userId].definitionIdChosen,
      });
      delete this.players[socket.userId];

      socket.broadcast.emit("update_state", {
        ...this.getState(),
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
    const oldUsername = this.players[socket.userId].username;
    this.players[socket.userId].username = body.username;

    io.emit("update_usernames", {
      allUsernames: Object.values(this.players).reduce((acc, player) => {
        return { ...acc, [player.userId]: player.username };
      }, {}),
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

    sessionStore.restartGameSession();

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
    this.players[socket.userId].definitionIdWritten = definitionId;
    this.definitions[socket.userId] = {
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
    this.players[socket.userId].definitionIdChosen = body.definition.id;
    this.nbVotes = Object.values(this.players).reduce((acc, player) => {
      if (player.definitionIdChosen) {
        return acc + 1;
      }
    }, 0);
    if (this.nbVotes === Object.keys(this.players).length) {
      this.step = 3;
      this.buildResultVotes();
      this.computeScores();
      io.emit("definitions_chosen", this.getState());
    }
  }

  public buildResultVotes = () => {
    for (const player of Object.values(this.players)) {
      this.results[player.definitionIdChosen].voters.push(player);
    }
  };

  public computeScores = () => {
    for (const result of Object.values(this.results)) {
      if (result.isReal) {
        result.voters.forEach((voter) => {
          this.players[voter.userId].score += SCORE_GUESS_RIGHT;
        });
      } else {
        const authorId = result.author.userId;
        this.players[authorId].score +=
          result.voters.filter((voter) => voter.userId !== authorId).length *
          SCORE_GET_VOTE;
      }
    }
  };
}
