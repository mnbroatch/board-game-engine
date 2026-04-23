import type { MoveDefinition, MoveMoveEntity } from "../../types/expanded-game-types.js";
import type { MoveEntityDoPayload } from "../../types/move-payload.js";
import type { BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ResolutionContext } from "../../types/resolution-context.js";
import { bankOf } from "../../utils/bgio-resolve-types.js";
import type { EngineEntity } from "../../types/runtime-entity.js";
import Move from "./move.js";

type ParentEntity = { remove: (entity: EngineEntity) => void };

export default class MoveEntity extends Move<NonNullable<MoveEntityDoPayload["arguments"]>> {
  do (
    bgioArguments: BgioResolveState,
    rule: MoveDefinition,
    resolvedPayload: MoveEntityDoPayload,
    _context: ResolutionContext
  ) {
    const { position } = rule as MoveMoveEntity;
    const { entity, destination } = resolvedPayload.arguments;
    const bank = bankOf(bgioArguments);
    const removeFromParent = (e: EngineEntity) => {
      (bank.findParent(e) as ParentEntity | undefined)?.remove(e);
    };
    if (Array.isArray(entity)) {
      entity.forEach((e: EngineEntity) => {
        removeFromParent(e);
        destination.placeEntity(e, position);
      });
    } else {
      removeFromParent(entity);
      destination.placeEntity(entity, position);
    }
  }
}
