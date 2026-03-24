import { Client as BoardgameIOClient } from "@mnbroatch/boardgame.io/client";
import { Debug } from "@mnbroatch/boardgame.io/debug";
import { SocketIO } from "@mnbroatch/boardgame.io/multiplayer";
import { serialize, deserialize } from "wackson";
import gameFactory from "../game-factory/game-factory.js";
import type { BoardGameEngineGame, BgioArguments } from "../game-factory/game-factory.js";
import type { Condition, GameFactoryInput } from "../types/bagel-types.js";
import { registry } from "../registry.js";
import simulateMove from "../utils/simulate-move.js";
import getCurrentMoves from "../utils/get-current-moves.js";
import type { GetCurrentMovesClient, GetCurrentMovesState } from "../utils/get-current-moves.js";
import resolveProperties from "../utils/resolve-properties.js";
import type { BgioResolveState } from "../utils/bgio-resolve-types.js";
import checkConditions from "../utils/check-conditions.js";
import preparePayload from "../utils/prepare-payload.js";
import getSteps from "../utils/get-steps.js";
import createPayload from "../utils/create-payload.js";

export interface ClientOptions {
  boardgameIOGame?: BoardGameEngineGame;
  /** JSON string of a {@link GameFactoryInput} rule object */
  gameRules?: string;
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

interface MoveBuilder {
  targets: unknown[];
  stepIndex: number;
  eliminatedMoves: string[];
}

export class Client {
  options: ClientOptions;
  game: BoardGameEngineGame;
  client?: ReturnType<typeof BoardgameIOClient>;
  moveBuilder?: MoveBuilder;
  optimisticWinner?: unknown | null;

  constructor (options: ClientOptions) {
    this.options = options;
    this.game = options.boardgameIOGame
      || gameFactory(JSON.parse(options.gameRules as string) as GameFactoryInput, options.gameName ?? "");

    if (!options.boardgameIOGame) {
      this.moveBuilder = { targets: [], stepIndex: 0, eliminatedMoves: [] };
      this.optimisticWinner = null;
    }
  }

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
      multiplayer = SocketIO({ server, socketOpts: { transports: ["websocket", "polling"] } }),
    } = this.options;

    try {
      const clientOptions = !credentials
        ? { game: this.game, numPlayers, debug }
        : {
            game: this.game,
            multiplayer,
            matchID,
            playerID: playerID ?? undefined,
            credentials,
            numPlayers,
            debug,
          };

      this.client = BoardgameIOClient(clientOptions as Parameters<typeof BoardgameIOClient>[0]);
      this.client.subscribe(() => this.update());
      this.client.start();
      return this;
    } catch (error: unknown) {
      const err = error as { message?: string; stack?: string };
      console.error("Failed to join game:", err?.message ?? error);
      if (err?.stack) console.error(err.stack);
    }
  }

  update () {
    this.options.onClientUpdate?.();
  }

  getState () {
    const bgioState = this.client?.getState();
    if (!bgioState) return {};

    const state = this.options.boardgameIOGame
      ? bgioState
      : {
        ...bgioState,
        G: deserialize(JSON.stringify(bgioState.G), registry),
      };

    const gameover = this.optimisticWinner ?? state?.ctx?.gameover;

    const currentMoves = gameover
      ? []
      : getCurrentMoves(state as GetCurrentMovesState, this.client as GetCurrentMovesClient);

    if (this.options.boardgameIOGame) {
      return {
        state,
        gameover,
        moves: this.client!.moves,
        currentMoves,
      };
    }

    const _wrappedMoves = Object.entries(currentMoves)
      .reduce<Record<string, unknown>>((acc, [moveName, rawMove]) => {
        const move = (payload: unknown) => {
          this.client!.moves[moveName](preparePayload(payload));
        };
        (move as { moveInstance?: unknown }).moveInstance = (rawMove as { moveInstance: unknown }).moveInstance;
        return { ...acc, [moveName]: move };
      }, {});

    const { allClickable, _possibleMoveMeta } = getPossibleMoves(state, _wrappedMoves, this.moveBuilder!);

    return { state, gameover, allClickable, _wrappedMoves, _possibleMoveMeta };
  }

  doStep (_target: unknown) {
    if (this.options.boardgameIOGame) return;

    const { state, _wrappedMoves, _possibleMoveMeta } = this.getState() as {
      state: { G: { bank: { locate: (id: unknown) => unknown } } };
      _wrappedMoves: Record<string, { (p: unknown): void; moveInstance: unknown }>;
      _possibleMoveMeta: Record<string, { clickableForMove: Set<unknown> }>;
    };

    const target = (_target as { abstract?: boolean; entityId?: unknown; value?: unknown }).abstract
      ? _target
      : state.G.bank.locate((_target as { entityId: unknown }).entityId);

    const newEliminated = Object.entries(_possibleMoveMeta)
      .filter(([_, meta]) => !hasTarget(meta.clickableForMove, target))
      .map(([name]) => name)
      .concat(this.moveBuilder!.eliminatedMoves);

    if (newEliminated.length === Object.keys(_wrappedMoves).length) {
      console.error("invalid move with target:", (target as { rule?: unknown })?.rule);
      return;
    }

    const remainingMoveEntries = Object.entries(_possibleMoveMeta)
      .filter(([name]) => !newEliminated.includes(name));

    if (isMoveCompleted(
      state,
      _wrappedMoves as Record<string, { moveInstance: { rule: unknown } }>,
      remainingMoveEntries,
      this.moveBuilder!.stepIndex
    )) {
      const [moveName] = remainingMoveEntries[0];
      const move = _wrappedMoves[moveName];
      const payload = createPayload(
        state as unknown as BgioResolveState,
        (move as { moveInstance: { rule: Parameters<typeof getSteps>[1] } }).moveInstance.rule,
        [...this.moveBuilder!.targets, target],
        { moveInstance: (move as { moveInstance: unknown }).moveInstance }
      );

      this.optimisticWinner = getWinnerAfterMove(state, this.game, (move as { moveInstance: unknown }).moveInstance, payload);
      move(payload);
      this.moveBuilder = { targets: [], stepIndex: 0, eliminatedMoves: [] };
    } else {
      this.moveBuilder = {
        eliminatedMoves: newEliminated,
        stepIndex: this.moveBuilder!.stepIndex + 1,
        targets: [...this.moveBuilder!.targets, target],
      };
    }

    this.update();
  }

  reset () {
    if (this.options.boardgameIOGame) return;
    this.moveBuilder = { targets: [], stepIndex: 0, eliminatedMoves: [] };
    this.optimisticWinner = null;
    this.update();
  }

  undoStep () {
    if (this.options.boardgameIOGame) return;
    if (this.moveBuilder!.targets.length) {
      this.moveBuilder = {
        targets: this.moveBuilder!.targets.slice(0, -1),
        stepIndex: Math.max(0, this.moveBuilder!.stepIndex - 1),
        eliminatedMoves: [],
      };
    }
    this.update();
  }
}

function hasTarget (clickableSet: Set<unknown>, target: unknown) {
  if (!(target as { abstract?: boolean }).abstract) return clickableSet.has(target);
  return [...clickableSet].some((item) => (item as { abstract?: boolean; value?: unknown }).abstract && (item as { value: unknown }).value === (target as { value: unknown }).value);
}

function getPossibleMoves (
  bgioState: unknown,
  moves: Record<string, unknown>,
  moveBuilder: MoveBuilder
) {
  const { eliminatedMoves, stepIndex } = moveBuilder;
  const _possibleMoveMeta: Record<string, { clickableForMove: Set<unknown> }> = {};
  const allClickable = new Set<unknown>();

  Object.entries(moves)
    .filter(([moveName]) => !eliminatedMoves.includes(moveName))
    .forEach(([moveName, move]) => {
      const moveRule = resolveProperties(bgioState as BgioResolveState, {
        ...(move as { moveInstance: { rule: Record<string, unknown> } }).moveInstance.rule,
        moveName,
      }) as { arguments?: Record<string, unknown> };

      const context = {
        moveInstance: (move as { moveInstance: unknown }).moveInstance,
        moveArguments: moveRule.arguments,
      };

      const targets = moveBuilder.targets.map((t) =>
        (t as { abstract?: boolean }).abstract ? t : (bgioState as { G: { bank: { locate: (id: unknown) => unknown } } }).G.bank.locate((t as { entityId: unknown }).entityId)
      );

      const payload = createPayload(
        bgioState as BgioResolveState,
        moveRule as Parameters<typeof getSteps>[1],
        targets,
        context
      );

      context.moveArguments = { ...context.moveArguments, ...payload.arguments };

      const moveIsAllowed = checkConditions(
        bgioState as BgioResolveState,
        (moveRule as { conditions?: Condition[] }).conditions,
        {},
        context
      ).conditionsAreMet;
      const moveSteps = getSteps(
        bgioState as BgioResolveState,
        moveRule as Parameters<typeof getSteps>[1]
      );

      const clickableForMove = new Set(
        (moveIsAllowed && moveSteps?.[stepIndex]?.getClickable(context)) || []
      );

      _possibleMoveMeta[moveName] = { clickableForMove };
      clickableForMove.forEach((entity) => allClickable.add(entity));
    });

  return { _possibleMoveMeta, allClickable };
}

function isMoveCompleted (
  state: unknown,
  moves: Record<string, { moveInstance: { rule: unknown } }>,
  remainingMoveEntries: [string, unknown][],
  stepIndex: number
) {
  return remainingMoveEntries.length === 1 &&
    getSteps(
      state as BgioResolveState,
      moves[remainingMoveEntries[0][0]].moveInstance.rule as Parameters<typeof getSteps>[1]
    ).length === stepIndex + 1;
}

function getWinnerAfterMove (
  state: unknown,
  game: BoardGameEngineGame,
  moveInstance: unknown,
  movePayload: unknown
) {
  const simulatedG = simulateMove(
    state as unknown as BgioResolveState,
    preparePayload(movePayload) as { arguments: Record<string, number | { abstract?: boolean; entityId?: unknown }> },
    { moveInstance: moveInstance as { doMove: (...args: unknown[]) => unknown } }
  );
  const endIf = game.endIf as ((ctx: BgioArguments) => unknown) | undefined;
  return endIf?.({ ...state as object, G: JSON.parse(serialize(simulatedG)) } as BgioArguments);
}
