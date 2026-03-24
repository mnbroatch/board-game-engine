import { serialize } from "wackson";
import type { GameFactoryInput, MoveDefinition, TurnConfig } from "../types/bagel-types.js";
import moveFactory from "./move/move-factory.js";
import Bank from "./bank/bank.js";
import expandGameRules from "./expand-game-rules.js";
import getScenarioResults from "../utils/get-scenario-results.js";
import doMoves from "../utils/do-moves.js";
import deserializeBgioArguments from "../utils/deserialize-bgio-arguments.js";
import type { BgioResolveState } from "../utils/bgio-resolve-types.js";

/** boardgame.io-style arguments (minimal typing; engine passes full objects). */
export type BgioArguments = BgioResolveState;

/** Object returned from `gameFactory` (boardgame.io game definition). */
export type BoardGameEngineGame = Record<string, unknown> & { name: string };

export default function gameFactory (
  gameRules: GameFactoryInput,
  gameName: string
): BoardGameEngineGame {
  const game: BoardGameEngineGame = { name: gameName };
  const rules = expandGameRules(gameRules);

  game.setup = (bgioArguments: BgioArguments) => {
    const { ctx } = bgioArguments;
    const initialState: Record<string, unknown> = {
      _meta: {
        passedPlayers: [],
        previousPayloads: {},
      },
    };

    const entityDefinitions = expandEntityDefinitions(rules.entities, ctx as { numPlayers: number }) as Record<string, unknown>[];
    const bank = new Bank(entityDefinitions);
    initialState.bank = bank;
    initialState.sharedBoard = bank.getOne(
      bgioArguments,
      {
        conditions: [{
          conditionType: "Is",
          matcher: { name: "sharedBoard" },
        }],
      },
      {}
    );

    if (rules.personalBoard) {
      initialState.personalBoards = (bgioArguments.ctx as { playOrder: string[] }).playOrder.map((playerID: string) =>
        bank.getOne(
          bgioArguments,
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
      moveFactory(moveRule, game).moveInstance!.doMove(
        { ...bgioArguments, G: initialState },
        undefined,
        {}
      );
    });
    return JSON.parse(serialize(initialState));
  };

  if (rules.moves) {
    game.moves = createMoves(rules.moves, game);
  }

  if (rules.turn) {
    game.turn = createTurn(rules.turn, game);
  }

  if (rules.phases) {
    game.phases = Object.entries(rules.phases).reduce<Record<string, unknown>>((acc, [name, phaseRule]) => ({
      ...acc,
      [name]: createPhase(phaseRule as Record<string, unknown>, game),
    }), {});
  }

  if (rules.endIf) {
    const endIfRules = rules.endIf;
    game.endIf = (bgioArguments: BgioArguments) => {
      const newBgioArguments = deserializeBgioArguments(bgioArguments);
      return getScenarioResults(newBgioArguments, endIfRules);
    };
  }

  if (!gameRules.DEBUG_DISABLE_SECRET_STATE) {
    game.playerView = (bgioArguments: BgioArguments) => {
      const { G, playerID } = deserializeBgioArguments(bgioArguments);
      const tracker = (G as { bank: { tracker: Record<string, {
        rule: { contentsHiddenFrom?: string; player?: string; hideLength?: boolean };
        spaces?: unknown[];
        entities?: unknown[];
      }> } }).bank.tracker;
      Object.values(tracker).forEach((entity) => {
        if (
          entity.rule.contentsHiddenFrom === "All" ||
          (
            entity.rule.contentsHiddenFrom === "Others" &&
            (
              playerID !== entity.rule.player ||
              playerID === undefined
            )
          )
        ) {
          if (entity.spaces) {
            entity.spaces = entity.rule.hideLength
              ? []
              : entity.spaces.map(() => (G as { bank: { createEntity: () => unknown } }).bank.createEntity());
          }
          if (entity.entities) {
            entity.entities = entity.rule.hideLength
              ? []
              : entity.entities.map(() => (G as { bank: { createEntity: () => unknown } }).bank.createEntity());
          }
        }
      });
      return JSON.parse(serialize(G));
    };
  }

  return game;
}

function expandEntityDefinitions (entities: unknown[], ctx: { numPlayers: number }) {
  return entities.reduce<unknown[]>((acc, entity) => {
    const entityCopy = { ...(entity as Record<string, unknown>) };

    if (entityCopy.perPlayer) {
      delete entityCopy.perPlayer;
      if (entityCopy.variants) {
        entityCopy.variants =
          (new Array(ctx.numPlayers)).fill(undefined).reduce<unknown[]>((accu, _, i) => [
            ...accu,
            ...(entityCopy.variants as unknown[]).map((variant: unknown) => ({ ...(variant as object), player: `${i}` })),
          ], []);
      } else {
        entityCopy.variants =
          (new Array(ctx.numPlayers)).fill(undefined).map((_, i) => ({ player: `${i}` }));
      }
    }

    if (entityCopy.variants) {
      const variants = entityCopy.variants as unknown[];
      delete entityCopy.variants;

      return [
        ...acc,
        ...variants.map((variant) => ({
          ...entityCopy,
          ...(variant as object),
        })),
      ];
    } else {
      return [
        ...acc,
        entityCopy,
      ];
    }
  }, []);
}

function createTurn (turnRule: TurnConfig | Record<string, unknown>, game: BoardGameEngineGame) {
  const turn = { ...turnRule } as Record<string, unknown>;

  turn.onBegin = (bgioArguments: BgioArguments) => {
    const newBgioArguments = deserializeBgioArguments(bgioArguments);
    const stageRule = (turnRule.stages as Record<string, { initialMoves?: MoveDefinition[] }> | undefined)?.[
      (newBgioArguments.ctx as { activePlayers?: Record<string, string>; currentPlayer: string }).activePlayers?.[
        (newBgioArguments.ctx as { currentPlayer: string }).currentPlayer
      ] as string
    ];

    (newBgioArguments.G as { _meta: { passedPlayers: string[] } })._meta.passedPlayers = (newBgioArguments.G as { _meta: { passedPlayers: string[] } })._meta.passedPlayers
      .filter((p) => p !== (newBgioArguments.ctx as { currentPlayer: string }).currentPlayer);

    doMoves(newBgioArguments, turnRule.initialMoves as MoveDefinition[] | undefined, { game });
    doMoves(newBgioArguments, stageRule?.initialMoves, { game });

    return JSON.parse(serialize(newBgioArguments.G));
  };

  if (turnRule.stages) {
    Object.entries(turnRule.stages as Record<string, { moves?: Record<string, MoveDefinition> }>).forEach(([stageName, stageRule]) => {
      if (stageRule.moves) {
        ((turn.stages as Record<string, { moves?: Record<string, unknown> }>)[stageName]).moves = createMoves(stageRule.moves, game);
      }
    });
  }

  const order = turnRule.order as {
    playOrder?: string | ((args: { ctx: { playOrder: string[] }; G: { _meta: { isAfterFirstPhase?: boolean } } }) => string[]);
    first?: () => number;
    next?: (args: { ctx: { playOrderPos: number; numPlayers: number } }) => number;
  } | undefined;
  if (order?.playOrder === "RotateFirst") {
    order.first = () => 0;
    order.next = ({ ctx }) => (ctx.playOrderPos + 1) % ctx.numPlayers;
    (turn.order as typeof order).playOrder = ({ ctx, G }) => {
      return G._meta.isAfterFirstPhase
        ? [...ctx.playOrder.slice(1), ctx.playOrder[0]]
        : ctx.playOrder;
    };
  }

  return turn;
}

function createPhase (phaseRule: Record<string, unknown>, game: BoardGameEngineGame) {
  const phase = { ...phaseRule };
  if (phaseRule.turn) {
    phase.turn = createTurn(phaseRule.turn as Record<string, unknown>, game);
  }
  if (phaseRule.moves) {
    phase.moves = createMoves(phaseRule.moves as Record<string, MoveDefinition>, game);
  }

  phase.onBegin = (bgioArguments: BgioArguments) => {
    const newBgioArguments = deserializeBgioArguments(bgioArguments);
    doMoves(newBgioArguments, phaseRule.initialMoves as MoveDefinition[] | undefined, { game });
    (newBgioArguments.G as { _meta: Record<string, unknown> })._meta.currentPhaseHasBeenSetUp = true;
    (newBgioArguments.G as { _meta: Record<string, unknown> })._meta.nextPhase = phaseRule.next;
    return JSON.parse(serialize(newBgioArguments.G));
  };

  if (phaseRule.endIf) {
    const phaseEndIf = phaseRule.endIf as unknown[];
    phase.endIf = (bgioArguments: BgioArguments) => {
      const newBgioArguments = deserializeBgioArguments(bgioArguments);
      if ((newBgioArguments.G as { _meta: { currentPhaseHasBeenSetUp?: boolean } })._meta.currentPhaseHasBeenSetUp) {
        const result = getScenarioResults(newBgioArguments, phaseEndIf);
        if (result) {
          return result;
        }
      }
    };
  }

  phase.onEnd = ({ G }: { G: { _meta: Record<string, unknown> } }) => {
    G._meta.currentPhaseHasBeenSetUp = false;
    G._meta.isAfterFirstPhase = true;
  };

  return phase;
}

function createMoves (moves: Record<string, MoveDefinition>, game: BoardGameEngineGame) {
  return Object.entries(moves).reduce<Record<string, unknown>>((acc, [name, moveDefinition]) => ({
    ...acc,
    [name]: moveFactory({ ...moveDefinition, name }, game),
  }), {});
}
