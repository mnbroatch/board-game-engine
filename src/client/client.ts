import { Debug } from "@mnbroatch/boardgame.io/debug";
import { SocketIO } from "@mnbroatch/boardgame.io/multiplayer";
import gameFactory from "../game-factory/game-factory.js";
import type { BoardgameIoGame } from "../game-factory/game-factory.js";
import type { BagelGame } from "../types/bagel-types.js";
import { EngineClientImpl, type EngineGetStateResult } from "./internal/engine-client.js";
import { ExternalClientImpl, type ExternalGetStateResult } from "./internal/external-client.js";

export interface ClientOptions {
  boardgameIOGame?: BoardgameIoGame;
  gameRules?: BagelGame;
  gameName?: string;
  server?: string;
  numPlayers?: number;
  debug?: {
    collapseOnLoad?: boolean;
    impl?: typeof Debug;
  };
  matchID?: string;
  playerID?: string | null;
  credentials?: string;
  multiplayer?: ReturnType<typeof SocketIO>;
  onClientUpdate?: () => void;
}

export type ClientGetStateResult =
  | { status: "empty" }
  | ExternalGetStateResult
  | EngineGetStateResult;

export class Client {
  private readonly options: ClientOptions;
  private readonly game: BoardgameIoGame;
  private readonly impl: EngineClientImpl | ExternalClientImpl;

  constructor (options: ClientOptions) {
    this.options = options;
    this.game = options.boardgameIOGame
      || gameFactory(options.gameRules!, options.gameName ?? "");
    this.impl = options.boardgameIOGame
      ? new ExternalClientImpl(options, this.game, () => this.update())
      : new EngineClientImpl(options, this.game, () => this.update());
  }

  connect () {
    this.impl.connect();
    return this;
  }

  update () {
    this.options.onClientUpdate?.();
  }

  getState (): ClientGetStateResult {
    return this.impl.getState();
  }

  doStep (_target: unknown) {
    this.impl.doStep(_target as never);
  }

  reset () {
    this.impl.reset();
  }

  undoStep () {
    this.impl.undoStep();
  }
}
