import { Client as BoardgameIOClient } from "@mnbroatch/boardgame.io/client";
import type { State } from "@mnbroatch/boardgame.io";
import { Debug } from "@mnbroatch/boardgame.io/debug";
import { SocketIO } from "@mnbroatch/boardgame.io/multiplayer";
import type { ClientOptions } from "../client.js";
import type { BoardgameEngineG, BoardgameIoGame } from "../../game-factory/game-factory.js";

type ExternalClientState = State<BoardgameEngineG>;
type ExternalClientMoves = ReturnType<typeof BoardgameIOClient>["moves"];
export type ExternalGetStateResult =
  | { status: "empty" }
  | {
    status: "external";
    state: ExternalClientState;
    gameover: unknown;
    moves: ExternalClientMoves;
    currentMoves: Record<string, unknown> | unknown[];
  };

function isExternalClientState (value: unknown): value is ExternalClientState {
  if (!value || typeof value !== "object") return false;
  return "G" in value && "ctx" in value;
}

export class ExternalClientImpl {
  client?: ReturnType<typeof BoardgameIOClient>;
  optimisticWinner?: unknown | null;

  constructor (
    private readonly options: ClientOptions,
    private readonly game: BoardgameIoGame,
    private readonly onUpdate: () => void
  ) {}

  connect () {
    const {
      server,
      numPlayers,
      debug = {
        collapseOnLoad: true,
        impl: Debug,
      },
      matchID,
      playerID,
      credentials,
      multiplayer,
    } = this.options;

    try {
      const effectivePlayerID = playerID === undefined ? "0" : playerID;
      const clientOptions = !credentials
        ? { game: this.game, numPlayers, debug, ...(effectivePlayerID == null ? {} : { playerID: effectivePlayerID }) }
        : {
            game: this.game,
            multiplayer: multiplayer ?? SocketIO({ server, socketOpts: { transports: ["websocket", "polling"] } }),
            matchID,
            ...(playerID == null ? {} : { playerID }),
            credentials,
            numPlayers,
            debug,
          };

      this.client = BoardgameIOClient(clientOptions);
      this.client.subscribe(() => this.onUpdate());
      this.client.start();
      return this;
    } catch (error: unknown) {
      const err = error as { message?: string; stack?: string };
      console.error("Failed to join game:", err?.message ?? error);
      if (err?.stack) console.error(err.stack);
    }
  }

  getState (): ExternalGetStateResult {
    const client = this.client;
    const bgioState = client?.getState();
    if (!bgioState) return { status: "empty" };
    if (!client) return { status: "empty" };

    if (!isExternalClientState(bgioState)) {
      throw new Error("Client.getState: unexpected external client state shape");
    }
    const state = bgioState;
    const gameover = this.optimisticWinner ?? (state.ctx as { gameover?: unknown } | undefined)?.gameover;
    const currentMoves = gameover ? [] : {};

    return {
      status: "external",
      state,
      gameover,
      moves: client.moves as ExternalClientMoves,
      currentMoves,
    };
  }

  doStep () {}
  reset () {}
  undoStep () {}
}

