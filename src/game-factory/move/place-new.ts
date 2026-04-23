import type { MoveDefinition, MovePlaceNew } from "../../types/expanded-game-types.js";
import type { PlaceNewDoPayload } from "../../types/move-payload.js";
import type { BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ResolutionContext } from "../../types/resolution-context.js";
import { bankOf } from "../../utils/bgio-resolve-types.js";
import type { EngineEntity } from "../../types/runtime-entity.js";
import Move from "./move.js";

type PlaceNewRule = MovePlaceNew & { count?: number; position?: unknown };

export default class PlaceNew extends Move<NonNullable<PlaceNewDoPayload["arguments"]>> {
  do (
    bgioArguments: BgioResolveState,
    rule: MoveDefinition,
    resolvedPayload: PlaceNewDoPayload,
    context: ResolutionContext
  ) {
    const { destination } = resolvedPayload.arguments;
    const r = rule as PlaceNewRule;
    const bank = bankOf(bgioArguments);
    const entityConditions = Array.isArray(r.entity?.conditions) ? r.entity.conditions : (r.entity?.conditions ? [r.entity.conditions] : []);
    const moveConditions = Array.isArray(r.conditions) ? r.conditions : (r.conditions ? [r.conditions] : []);
    const entities = r.matchMultiple
      ? bank.getMultiple(
          bgioArguments,
          {
            ...r.entity,
            conditions: [
              ...entityConditions,
              ...moveConditions,
            ]
          },
          r.count ?? 1,
          context
        )
      : [bank.getOne(
          bgioArguments,
          {
            ...r.entity,
            conditions: [
              ...entityConditions,
              ...moveConditions,
            ]
          },
          context
        )]
    entities.forEach((entity: EngineEntity) => {
      destination.placeEntity(entity, r.position);
    });
  }
}
