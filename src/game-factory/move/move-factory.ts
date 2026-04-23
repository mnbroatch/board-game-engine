import type { MoveFn } from "@mnbroatch/boardgame.io";
import { INVALID_MOVE } from "@mnbroatch/boardgame.io/dist/cjs/core.js";
import deserializeBgioArguments from "../../utils/deserialize-bgio-arguments.js";
import {
  cloneBoardgameEngineGJsonRoundtrip,
  deserializeWithRegistry,
} from "../../utils/engine-serde-boundary.js";
import type { MovePayload } from "../../types/move-payload.js";
import type { MoveArgumentsMap } from "../../types/move-arguments.js";
import type { MoveArgumentValue, MoveArgumentsState } from "../../types/resolution-context.js";
import type { BoardgameEngineG, BoardgameIoGame } from "../game-factory.js";
import MoveEntity from "./move-entity.js";
import RemoveEntity from "./remove-entity.js";
import PlaceNew from "./place-new.js";
import TakeFrom from "./take-from.js";
import SetState from "./set-state.js";
import SetActivePlayers from "./set-active-players.js";
import EndTurn from "./end-turn.js";
import PassTurn from "./pass-turn.js";
import ForEach from "./for-each.js";
import Pass from "./pass.js";
import Shuffle from "./shuffle.js";
import type { MoveDefinition } from "../../types/expanded-game-types.js";
import type { BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type Move from "./move.js";

/** boardgame.io move function plus engine metadata for staged moves / UI. */
export type BoardgameEngineMove = MoveFn<BoardgameEngineG> & { moveInstance: Move<MoveArgumentsMap> };

type MoveFactoryContext = {
  moveInstance: Move<MoveArgumentsMap>;
  game: BoardgameIoGame;
  moveConditionResults: unknown[];
};

export default function moveFactory (moveRule: MoveDefinition, game: BoardgameIoGame): BoardgameEngineMove {
  const moveInstance = getMoveInstance(moveRule);

  // boardgame.io `MoveFn`: serialized payload in first rest arg; returns serialized `G`.
  const compatibleMove = (function (
    bgioArguments: Parameters<MoveFn<BoardgameEngineG>>[0],
    serializablePayload?: unknown
  ): ReturnType<MoveFn<BoardgameEngineG>> {
    const newBgioArguments: BgioResolveState = deserializeBgioArguments(bgioArguments);
    const { G } = newBgioArguments;
    const payload = revivePayload(serializablePayload, G as { bank: { locate: (id: number) => unknown } });
    const factoryContext: MoveFactoryContext = { moveInstance, game, moveConditionResults: [] };
    const moveConditionResults = moveInstance.doMove(newBgioArguments, payload, factoryContext);

    factoryContext.moveConditionResults.push(moveConditionResults);

    if (moveConditionResults !== INVALID_MOVE && moveRule.then) {
      for (const automaticMoveRule of moveRule.then) {
        const auto = getMoveInstance(automaticMoveRule);
        const result = auto.doMove(
          newBgioArguments,
          {},
          { ...factoryContext } // spread here so prevArguments doesn't change for sibling
        );
        factoryContext.moveConditionResults.push(result);
      }
    }

    return cloneBoardgameEngineGJsonRoundtrip(G);
  }) as BoardgameEngineMove;
  compatibleMove.moveInstance = moveInstance;
  return compatibleMove;
}

function revivePayload (
  serializablePayload: unknown,
  G: { bank: { locate: (id: number) => unknown } }
): MovePayload<MoveArgumentsMap> | undefined {
  if (!serializablePayload) {
    return undefined;
  }
  const payload = deserializeWithRegistry<MovePayload<MoveArgumentsMap> & { arguments?: Record<string, unknown> }>(
    serializablePayload
  );
  const rawArgs = payload.arguments ?? {};
  payload.arguments = Object.entries(rawArgs).reduce<MoveArgumentsState>((acc, [key, argOrEntityId]) => {
    const hydrated: MoveArgumentValue | undefined =
      typeof argOrEntityId === "number"
        ? (G.bank.locate(argOrEntityId) as MoveArgumentValue)
        : (argOrEntityId as MoveArgumentValue | undefined);
    return { ...acc, [key]: hydrated };
  }, {});
  return payload;
}

export function getMoveInstance (moveRule: MoveDefinition): Move<MoveArgumentsMap> {
  switch (moveRule.moveType) {
    case 'MoveEntity':
      return new MoveEntity(moveRule) as Move<MoveArgumentsMap>;
    case 'PlaceNew':
      return new PlaceNew(moveRule) as Move<MoveArgumentsMap>;
    case 'RemoveEntity':
      return new RemoveEntity(moveRule) as Move<MoveArgumentsMap>;
    case 'TakeFrom':
      return new TakeFrom(moveRule) as Move<MoveArgumentsMap>;
    case 'SetState':
      return new SetState(moveRule) as Move<MoveArgumentsMap>;
    case 'ForEach':
      return new ForEach(moveRule) as Move<MoveArgumentsMap>;
    case 'Pass':
      return new Pass(moveRule) as Move<MoveArgumentsMap>;
    case 'Shuffle':
      return new Shuffle(moveRule) as Move<MoveArgumentsMap>;
    case 'SetActivePlayers':
      return new SetActivePlayers(moveRule) as Move<MoveArgumentsMap>;
    case 'EndTurn':
      return new EndTurn(moveRule) as Move<MoveArgumentsMap>;
    case 'PassTurn':
      return new PassTurn(moveRule) as Move<MoveArgumentsMap>;
    default:
      throw new Error(`moveFactory: unknown moveType ${(moveRule as { moveType?: unknown }).moveType as string}`);
  }
}
