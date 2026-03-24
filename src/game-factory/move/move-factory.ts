import { serialize, deserialize } from 'wackson'
import { INVALID_MOVE } from '@mnbroatch/boardgame.io/dist/cjs/core.js';
import { registry } from '../../registry.js'
import deserializeBgioArguments from '../../utils/deserialize-bgio-arguments.js'
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
import type { MoveDefinition } from "../../types/bagel-types.js";
import type { BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type Move from "./move.js";

type MoveFactoryContext = {
  moveInstance: Move;
  game: unknown;
  moveConditionResults?: unknown[];
};

export default function moveFactory (moveRule: MoveDefinition, game: unknown) {
  const moveInstance = getMoveInstance(moveRule);
  if (!moveInstance) {
    throw new Error("moveFactory: unknown moveType");
  }

  // accepts serialized G and payload, returns serialized
  const compatibleMove = function (
    bgioArguments: unknown,
    serializablePayload: unknown
  ) {
    const newBgioArguments = deserializeBgioArguments(bgioArguments as BgioResolveState);
    const { G } = newBgioArguments;
    const payload = revivePayload(serializablePayload, G as { bank: { locate: (id: number) => unknown } });
    const context: MoveFactoryContext = { moveInstance, game };
    const moveConditionResults = moveInstance.doMove(newBgioArguments, payload, context);

    context.moveConditionResults = [moveConditionResults];

    if (moveConditionResults !== INVALID_MOVE && moveRule.then) {
      for (const automaticMoveRule of moveRule.then) {
        const auto = getMoveInstance(automaticMoveRule);
        if (!auto) continue;
        const result = auto.doMove(
          newBgioArguments,
          {},
          { ...context } // spread here so prevArguments doesn't change for sibling
        );
        context.moveConditionResults!.push(result);
      }
    }

    return JSON.parse(serialize(G));
  };
  compatibleMove.moveInstance = moveInstance;
  return compatibleMove;
}

function revivePayload (
  serializablePayload: unknown,
  G: { bank: { locate: (id: number) => unknown } }
): { arguments?: Record<string, unknown> } | undefined {
  if (!serializablePayload) {
    return undefined;
  }
  const payload = deserialize(JSON.stringify(serializablePayload), registry) as {
    arguments: Record<string, unknown>;
  };
  payload.arguments =
    Object.entries(payload.arguments).reduce<Record<string, unknown>>((acc, [key, argOrEntityId]) => ({
      ...acc,
      [key]: typeof argOrEntityId === "number" ? G.bank.locate(argOrEntityId as number) : argOrEntityId
    }), {});
  return payload;
}

export function getMoveInstance (moveRule: MoveDefinition) {
  switch (moveRule.moveType) {
    case 'MoveEntity':
      return new MoveEntity(moveRule);
    case 'PlaceNew':
      return new PlaceNew(moveRule);
    case 'RemoveEntity':
      return new RemoveEntity(moveRule);
    case 'TakeFrom':
      return new TakeFrom(moveRule);
    case 'SetState':
      return new SetState(moveRule);
    case 'ForEach':
      return new ForEach(moveRule);
    case 'Pass':
      return new Pass(moveRule);
    case 'Shuffle':
      return new Shuffle(moveRule);
    case 'SetActivePlayers':
      return new SetActivePlayers(moveRule);
    case 'EndTurn':
      return new EndTurn(moveRule);
    case 'PassTurn':
      return new PassTurn(moveRule);
  }
}
