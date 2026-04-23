import type { Game, MoveMap, PhaseMap } from "@mnbroatch/boardgame.io";
import type { Entity } from "../types/bagel-types.js";
import type {
  AuthoredGameRules,
  GameRules,
  MoveDefinition,
  PhaseConfig,
  StageConfig,
  TurnConfig,
} from "../types/expanded-game-types.js";
import type { EntityDefinition } from "../types/entity-definition.js";
import moveFactory, { type BoardgameEngineMove } from "./move/move-factory.js";
import Bank from "./bank/bank.js";
import expandGameRules from "./expand-game-rules.js";
import getScenarioResults from "../utils/get-scenario-results.js";
import doMoves from "../utils/do-moves.js";
import deserializeBgioArguments from "../utils/deserialize-bgio-arguments.js";
import { cloneBoardgameEngineGJsonRoundtrip } from "../utils/engine-serde-boundary.js";
import type { BoardgameEngineG, BgioResolveState } from "../utils/bgio-resolve-types.js";

export type { BoardgameEngineG, BoardgameEngineMeta } from "../utils/bgio-resolve-types.js";

/** boardgame.io `Game` definition produced by {@link gameFactory}. */
export type BoardgameIoGame = Game<BoardgameEngineG>;

type GameSetup = NonNullable<BoardgameIoGame["setup"]>;
type GameEndIf = NonNullable<BoardgameIoGame["endIf"]>;
type GamePlayerView = NonNullable<BoardgameIoGame["playerView"]>;
type TurnConfigBgio = NonNullable<BoardgameIoGame["turn"]>;
type TurnOnBegin = NonNullable<TurnConfigBgio["onBegin"]>;
type TurnOrderConfigBgio = NonNullable<TurnConfigBgio["order"]>;
type PhaseConfigBgio = NonNullable<NonNullable<BoardgameIoGame["phases"]>[string]>;
type PhaseOnBegin = NonNullable<PhaseConfigBgio["onBegin"]>;
type PhaseOnEnd = NonNullable<PhaseConfigBgio["onEnd"]>;
type PhaseEndIf = NonNullable<PhaseConfigBgio["endIf"]>;
type GameMoveMap = MoveMap<BoardgameEngineG>;
type GamePhaseMap = PhaseMap<BoardgameEngineG>;
type EntityVariant = Partial<EntityDefinition>;
type ExpandableEntity = Entity & {
  perPlayer?: boolean;
  variants?: EntityVariant[];
};

function setupResolveState (
  setupContext: Parameters<GameSetup>[0],
  G: BoardgameEngineG
): BgioResolveState {
  return { ...setupContext, G };
}

export default function gameFactory (
  gameRules: AuthoredGameRules,
  gameName: string
): BoardgameIoGame {
  const game: BoardgameIoGame = { name: gameName };
  const rules: GameRules = expandGameRules(gameRules);

  game.setup = ((setupContext, _setupData) => {
    const { ctx } = setupContext;
    const entityDefinitions = expandEntityDefinitions(rules.entities, ctx);
    const bank = new Bank(entityDefinitions);
    const initialState: BoardgameEngineG = {
      _meta: {
        passedPlayers: [],
        previousPayloads: {},
      },
      bank,
    };

    const resolveDuringSetup = () => setupResolveState(setupContext, initialState);

    initialState.sharedBoard = bank.getOne(
      resolveDuringSetup(),
      {
        conditions: [{
          conditionType: "Is",
          matcher: { name: "sharedBoard" },
        }],
      },
      {}
    );

    if (rules.personalBoard) {
      initialState.personalBoards = ctx.playOrder.map((playerID) =>
        bank.getOne(
          resolveDuringSetup(),
          {
            conditions: [{
              conditionType: "Is",
              matcher: {
                name: "personalBoard",
                player: playerID,
              },
            }],
          },
          {}
        )
      );
    }

    rules.initialMoves?.forEach((moveRule) => {
      moveFactory(moveRule, game).moveInstance.doMove(
        resolveDuringSetup(),
        undefined,
        {}
      );
    });
    return cloneBoardgameEngineGJsonRoundtrip(initialState);
  }) satisfies GameSetup;

  if (rules.moves) {
    game.moves = createMoves(rules.moves, game);
  }

  if (rules.turn) {
    game.turn = createTurn(rules.turn, game);
  }

  if (rules.phases) {
    game.phases = Object.entries(rules.phases).reduce<GamePhaseMap>((acc, [name, phaseRule]) => ({
      ...acc,
      [name]: createPhase(phaseRule, game),
    }), {});
  }

  if (rules.endIf) {
    const endIfRules = rules.endIf;
    game.endIf = ((context) => {
      const newBgioArguments: BgioResolveState = deserializeBgioArguments(context);
      return getScenarioResults(newBgioArguments, endIfRules);
    }) satisfies GameEndIf;
  }

  if (!gameRules.DEBUG_DISABLE_SECRET_STATE) {
    game.playerView = ((context) => {
      const { G, playerID } = deserializeBgioArguments(context);
      const tracker = G.bank.tracker;
      Object.values(tracker).forEach((entity) => {
        if (
          entity.rule.contentsHiddenFrom === "All" ||
          (
            entity.rule.contentsHiddenFrom === "Others" &&
            (
              playerID !== entity.rule.player ||
              playerID === null
            )
          )
        ) {
          if ("spaces" in entity && entity.spaces) {
            entity.spaces = entity.rule.hideLength
              ? []
              : entity.spaces.map(() => G.bank.createEntity());
          }
          if ("entities" in entity && entity.entities) {
            entity.entities = entity.rule.hideLength
              ? []
              : entity.entities.map(() => G.bank.createEntity());
          }
        }
      });
      return cloneBoardgameEngineGJsonRoundtrip(G);
    }) satisfies GamePlayerView;
  }

  return game;
}

function expandEntityDefinitions (entities: Entity[], ctx: { numPlayers: number }): EntityDefinition[] {
  return entities.reduce<EntityDefinition[]>((acc, entity) => {
    const source = entity as ExpandableEntity;
    const { perPlayer, variants } = source;
    const base = { ...source };
    delete base.perPlayer;
    delete base.variants;
    const expandedBase = base as EntityDefinition;

    const expandedVariants: EntityVariant[] | undefined = perPlayer
      ? (variants
          ? Array.from({ length: ctx.numPlayers }).flatMap((_, i) =>
              variants.map((variant) => ({ ...variant, player: `${i}` }))
            )
          : Array.from({ length: ctx.numPlayers }, (_, i) => ({ player: `${i}` })))
      : variants;

    if (expandedVariants && expandedVariants.length) {
      return [
        ...acc,
        ...expandedVariants.map((variant) => ({
          ...expandedBase,
          ...variant,
        }) as EntityDefinition),
      ];
    }

    return [...acc, expandedBase];
  }, []);
}

function createTurn (turnRule: TurnConfig, game: BoardgameIoGame): TurnConfigBgio {
  const turn = { ...turnRule } as TurnConfigBgio;

  turn.onBegin = ((context) => {
    const newBgioArguments: BgioResolveState = deserializeBgioArguments(context);
    const stageName = newBgioArguments.ctx.activePlayers?.[newBgioArguments.ctx.currentPlayer];
    const stageRule = stageName != null
      ? turnRule.stages?.[stageName]
      : undefined;

    newBgioArguments.G._meta.passedPlayers = newBgioArguments.G._meta.passedPlayers
      .filter((p) => p !== newBgioArguments.ctx.currentPlayer);

    doMoves(newBgioArguments, turnRule.initialMoves, { game });
    doMoves(newBgioArguments, stageRule?.initialMoves, { game });

    return cloneBoardgameEngineGJsonRoundtrip(newBgioArguments.G);
  }) satisfies TurnOnBegin;

  if (turnRule.stages) {
    Object.entries<StageConfig>(turnRule.stages).forEach(([stageName, stageRule]) => {
      if (stageRule.moves) {
        (turn.stages![stageName] as { moves?: GameMoveMap }).moves = createMoves(stageRule.moves, game);
      }
    });
  }

  const order = turnRule.order as {
    playOrder?: string | ((args: { ctx: { playOrder: string[] }; G: BoardgameEngineG }) => string[]);
    first?: () => number;
    next?: (args: { ctx: { playOrderPos: number; numPlayers: number } }) => number;
  } | undefined;
  if (order?.playOrder === "RotateFirst") {
    order.first = () => 0;
    order.next = (fnCtx) => (fnCtx.ctx.playOrderPos + 1) % fnCtx.ctx.numPlayers;
    (turn.order as TurnOrderConfigBgio).playOrder = (fnCtx) => {
      const { ctx, G } = fnCtx;
      return G._meta.isAfterFirstPhase
        ? [...ctx.playOrder.slice(1), ctx.playOrder[0]]
        : ctx.playOrder;
    };
  }

  return turn;
}

function createPhase (phaseRule: PhaseConfig, game: BoardgameIoGame): PhaseConfigBgio {
  const phase = { ...phaseRule } as PhaseConfigBgio;
  if (phaseRule.turn) {
    phase.turn = createTurn(phaseRule.turn, game);
  }
  if (phaseRule.moves) {
    phase.moves = createMoves(phaseRule.moves, game);
  }

  phase.onBegin = ((context) => {
    const newBgioArguments: BgioResolveState = deserializeBgioArguments(context);
    doMoves(newBgioArguments, phaseRule.initialMoves, { game });
    newBgioArguments.G._meta.currentPhaseHasBeenSetUp = true;
    newBgioArguments.G._meta.nextPhase = phaseRule.next;
    return cloneBoardgameEngineGJsonRoundtrip(newBgioArguments.G);
  }) satisfies PhaseOnBegin;

  if (phaseRule.endIf) {
    const phaseEndIf = phaseRule.endIf;
    phase.endIf = ((context) => {
      const newBgioArguments: BgioResolveState = deserializeBgioArguments(context);
      if (newBgioArguments.G._meta.currentPhaseHasBeenSetUp) {
        const result = getScenarioResults(newBgioArguments, phaseEndIf);
        if (result) {
          return result as boolean | { next: string };
        }
      }
    }) satisfies PhaseEndIf;
  }

  phase.onEnd = ((context) => {
    const { G } = context;
    G._meta.currentPhaseHasBeenSetUp = false;
    G._meta.isAfterFirstPhase = true;
  }) satisfies PhaseOnEnd;

  return phase;
}

function createMoves (moves: Record<string, MoveDefinition>, game: BoardgameIoGame): GameMoveMap {
  return Object.entries(moves).reduce<Record<string, BoardgameEngineMove>>((acc, [name, moveDefinition]) => ({
    ...acc,
    [name]: moveFactory({ ...moveDefinition, name }, game),
  }), {});
}
