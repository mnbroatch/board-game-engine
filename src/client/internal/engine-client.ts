import { Client as BoardgameIOClient } from "@mnbroatch/boardgame.io/client";
import { Debug } from "@mnbroatch/boardgame.io/debug";
import { SocketIO } from "@mnbroatch/boardgame.io/multiplayer";
import type { BoardgameIoGame } from "../../game-factory/game-factory.js";
import type { Condition } from "../../types/expanded-game-types.js";
import type {
  AbstractPickArgument,
  ClientMovePayload,
  MoveType,
  MovePayload,
  PreparedMovePayload,
} from "../../types/move-payload.js";
import type { MoveArgumentsMap } from "../../types/move-arguments.js";
import type { MoveArgumentsState, ResolutionContext } from "../../types/resolution-context.js";
import type Move from "../../game-factory/move/move.js";
import {
  cloneBoardgameEngineGJsonRoundtrip,
  reviveBoardgameEngineGFromUnknownRawG,
} from "../../utils/engine-serde-boundary.js";
import simulateMove, { type SimulatePreparedArguments } from "../../utils/simulate-move.js";
import getCurrentMoves from "../../utils/get-current-moves.js";
import type { GetCurrentMovesClient, GetCurrentMovesState } from "../../utils/get-current-moves.js";
import resolveProperties from "../../utils/resolve-properties.js";
import type { BoardgameEngineG, BgioReadonlyState, BgioResolveState } from "../../utils/bgio-resolve-types.js";
import checkConditions from "../../utils/check-conditions.js";
import preparePayload from "../../utils/prepare-payload.js";
import getSteps from "../../utils/get-steps.js";
import createPayload from "../../utils/create-payload.js";
import type { EngineEntity } from "../../types/runtime-entity.js";
import type { ClientOptions } from "../client.js";
import type { BoardgameEngineMove } from "../../game-factory/move/move-factory.js";
import type { MoveArgumentBinding } from "../../types/expanded-game-types.js";

type StepTarget = AbstractPickArgument | EngineEntity;

interface MoveBuilder {
  targets: StepTarget[];
  stepIndex: number;
  eliminatedMoves: string[];
}

type ClientResolveStateLike = BgioReadonlyState & { G: BoardgameEngineG };
type WrappedMoveFor<M extends MoveType> =
  & ((payload: ClientMovePayload<M>) => void)
  & { moveType: M; moveInstance: Move<MoveArgumentsMap> };
type WrappedMove = { [M in MoveType]: WrappedMoveFor<M> }[MoveType];
type PossibleMoveMeta = Record<string, { clickableForMove: Set<StepTarget> }>;

export type EngineGetStateResult =
  | { status: "empty" }
  | {
    status: "engine";
    state: ClientResolveStateLike;
    gameover: unknown;
    allClickable: Set<StepTarget>;
    _wrappedMoves: Record<string, WrappedMove>;
    _possibleMoveMeta: PossibleMoveMeta;
  };

function toClientResolveStateLike (
  bgioState: unknown,
  revivedG: BoardgameEngineG
): ClientResolveStateLike {
  // boardgame.io's `getState()` type includes plugin APIs (events/random) that are not present on
  // the raw state object we receive here. We only rely on a narrow subset of fields plus `G`,
  // so we confine validation/coercion to this boundary helper.
  if (!bgioState || typeof bgioState !== "object") {
    throw new Error("Client.getState(): expected boardgame.io state object");
  }
  const s = bgioState as { ctx?: unknown; playerID?: unknown };
  if (!s.ctx || typeof s.ctx !== "object") {
    throw new Error("Client.getState(): expected state.ctx object");
  }
  return {
    G: revivedG,
    ctx: s.ctx as ClientResolveStateLike["ctx"],
    ...(s.playerID == null ? {} : { playerID: s.playerID as ClientResolveStateLike["playerID"] }),
  };
}

export class EngineClientImpl {
  client?: ReturnType<typeof BoardgameIOClient>;
  optimisticWinner: unknown | null;
  private moveBuilder: MoveBuilder;

  constructor (
    private readonly options: ClientOptions,
    private readonly game: BoardgameIoGame,
    private readonly onUpdate: () => void
  ) {
    this.moveBuilder = { targets: [], stepIndex: 0, eliminatedMoves: [] };
    this.optimisticWinner = null;
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

  getState (): EngineGetStateResult {
    const client = this.client;
    const bgioState = client?.getState();
    if (!bgioState) return { status: "empty" };
    if (!client) return { status: "empty" };

    const revivedG = reviveBoardgameEngineGFromUnknownRawG(bgioState.G);
    const state = toClientResolveStateLike(bgioState, revivedG);
    const gameover = this.optimisticWinner ?? state?.ctx?.gameover;
    const currentMoves = gameover
      ? []
      : getCurrentMoves<BoardgameEngineMove>(state as GetCurrentMovesState, client as GetCurrentMovesClient);

    const _wrappedMoves = Object.entries(currentMoves)
      .reduce<Record<string, WrappedMove>>((acc, [moveName, rawMove]) => {
        const move = ((payload: ClientMovePayload<MoveType>) => {
          client.moves[moveName](preparePayload(payload));
        }) as WrappedMove;
        move.moveInstance = rawMove.moveInstance;
        move.moveType = rawMove.moveInstance.rule.moveType as MoveType;
        return { ...acc, [moveName]: move };
      }, {});

    const { allClickable, _possibleMoveMeta } = getPossibleMoves(state, _wrappedMoves, this.moveBuilder);

    return { status: "engine", state, gameover, allClickable, _wrappedMoves, _possibleMoveMeta };
  }

  doStep (_target: StepTarget) {
    const s = this.getState();
    if (s.status !== "engine") return;
    const { state, _wrappedMoves, _possibleMoveMeta } = s;

    const target: StepTarget = isAbstractStepTarget(_target)
      ? _target
      : (() => {
          const id = (_target as { entityId?: unknown } | undefined)?.entityId;
          if (typeof id !== "number") {
            throw new Error("Client.doStep: expected StepTarget.entityId number");
          }
          return state.G.bank.locate(id);
        })();

    const newEliminated = Object.entries(_possibleMoveMeta)
      .filter(([_, meta]) => !hasTarget(meta.clickableForMove, target))
      .map(([name]) => name)
      .concat(this.moveBuilder.eliminatedMoves);

    if (newEliminated.length === Object.keys(_wrappedMoves).length) {
      console.error("invalid move with target:", getTargetRuleForLog(target));
      return;
    }

    const remainingMoveEntries = Object.entries(_possibleMoveMeta)
      .filter(([name]) => !newEliminated.includes(name));

    if (isMoveCompleted(
      state,
      _wrappedMoves,
      remainingMoveEntries,
      this.moveBuilder.stepIndex
    )) {
      const [moveName] = remainingMoveEntries[0];
      const move = _wrappedMoves[moveName];
      const payload = createPayload(
        state,
        move.moveInstance.rule as Parameters<typeof getSteps>[1],
        [...this.moveBuilder.targets, target],
        { moveInstance: move.moveInstance }
      );

      this.optimisticWinner = getWinnerAfterMove(state, this.game, move.moveInstance, payload);
      move(payload);
      this.moveBuilder = { targets: [], stepIndex: 0, eliminatedMoves: [] };
    } else {
      this.moveBuilder = {
        eliminatedMoves: newEliminated,
        stepIndex: this.moveBuilder.stepIndex + 1,
        targets: [...this.moveBuilder.targets, target],
      };
    }

    this.onUpdate();
  }

  reset () {
    this.moveBuilder = { targets: [], stepIndex: 0, eliminatedMoves: [] };
    this.optimisticWinner = null;
    this.onUpdate();
  }

  undoStep () {
    if (this.moveBuilder.targets.length) {
      this.moveBuilder = {
        targets: this.moveBuilder.targets.slice(0, -1),
        stepIndex: Math.max(0, this.moveBuilder.stepIndex - 1),
        eliminatedMoves: [],
      };
    }
    this.onUpdate();
  }
}

function hasTarget (clickableSet: Set<StepTarget>, target: StepTarget) {
  if (!isAbstractStepTarget(target)) return clickableSet.has(target);
  return [...clickableSet].some((item) =>
    isAbstractStepTarget(item) && item.value === target.value
  );
}

function isAbstractStepTarget (arg: StepTarget): arg is AbstractPickArgument & { value?: unknown } {
  return Boolean(arg && typeof arg === "object" && "abstract" in arg && (arg as { abstract?: unknown }).abstract === true);
}

function getTargetRuleForLog (target: StepTarget): unknown {
  if (target && typeof target === "object" && "rule" in target) {
    return (target as { rule?: unknown }).rule;
  }
  return undefined;
}

function getPossibleMoves (
  bgioState: ClientResolveStateLike,
  moves: Record<string, WrappedMove>,
  moveBuilder: MoveBuilder
) {
  const { eliminatedMoves, stepIndex } = moveBuilder;
  const _possibleMoveMeta: PossibleMoveMeta = {};
  const allClickable = new Set<StepTarget>();

  Object.entries(moves)
    .filter(([moveName]) => !eliminatedMoves.includes(moveName))
    .forEach(([moveName, move]) => {
      const moveRule = resolveProperties(bgioState, {
        ...move.moveInstance.rule,
        moveName,
      }) as { moveType: string; arguments?: Record<string, MoveArgumentBinding>; conditions?: unknown };

      const context: ResolutionContext = {
        moveInstance: move.moveInstance,
        moveArguments: moveRule.arguments as MoveArgumentsState | undefined,
      };

      const targets = moveBuilder.targets.map((t) =>
        isAbstractStepTarget(t)
          ? t
          : bgioState.G.bank.locate((t as { entityId: number }).entityId)
      );

      const payload = createPayload(
        bgioState,
        moveRule,
        targets,
        context
      );

      context.moveArguments = { ...context.moveArguments, ...payload.arguments };

      const moveIsAllowed = checkConditions(
        bgioState,
        (moveRule as { conditions?: Condition | Condition[] }).conditions,
        {},
        context
      ).conditionsAreMet;
      const moveSteps = getSteps(
        bgioState,
        moveRule
      );

      const rawClickable = (moveIsAllowed && moveSteps?.[stepIndex]?.getClickable(context)) || [];
      const clickableForMove = new Set<StepTarget>(rawClickable as StepTarget[]);

      _possibleMoveMeta[moveName] = { clickableForMove };
      clickableForMove.forEach((entity) => allClickable.add(entity));
    });

  return { _possibleMoveMeta, allClickable };
}

function isMoveCompleted (
  state: ClientResolveStateLike,
  moves: Record<string, WrappedMove>,
  remainingMoveEntries: Array<[string, PossibleMoveMeta[string]]>,
  stepIndex: number
) {
  return remainingMoveEntries.length === 1 &&
    getSteps(
      state,
      moves[remainingMoveEntries[0][0]].moveInstance.rule as {
        moveType: string;
        arguments?: { [argumentName: string]: MoveArgumentBinding | undefined };
      }
    ).length === stepIndex + 1;
}

function getWinnerAfterMove (
  state: ClientResolveStateLike,
  game: BoardgameIoGame,
  moveInstance: Move<MoveArgumentsMap>,
  movePayload: MovePayload<MoveArgumentsMap>
) {
  const simulatedG = simulateMove(
    state,
    preparePayload(movePayload) as PreparedMovePayload<SimulatePreparedArguments> & {
      arguments: SimulatePreparedArguments;
    },
    { moveInstance }
  );
  const endIf = game.endIf as ((ctx: BgioResolveState) => unknown) | undefined;
  return endIf?.({
    ...state as object,
    G: cloneBoardgameEngineGJsonRoundtrip(simulatedG),
  } as BgioResolveState);
}

