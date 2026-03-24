import type { MovePlaceNew } from "../../types/bagel-types.js";
import type { BgioResolveState } from "../../utils/bgio-resolve-types.js";
import { bankOf } from "../../utils/bgio-resolve-types.js";
import Move from "./move.js";

type PlaceNewRule = MovePlaceNew & { count?: number; position?: unknown };

export default class PlaceNew extends Move {
  do (bgioArguments: unknown, rule: unknown, resolvedPayload: unknown, context: Record<string, unknown>) {
    const { destination } = (resolvedPayload as { arguments: { destination: unknown } }).arguments;
    const bgio = bgioArguments as BgioResolveState;
    const r = rule as PlaceNewRule;
    const bank = bankOf(bgio);
    const entities = r.matchMultiple
      ? bank.getMultiple(
          bgio,
          {
            ...r.entity,
            conditions: [
              ...(r.entity?.conditions || []),
              ...(r.conditions || []),
            ]
          },
          r.count ?? 1,
          context
        )
      : [bank.getOne(
          bgio,
          {
            ...r.entity,
            conditions: [
              ...(r.entity?.conditions || []),
              ...(r.conditions || []),
            ]
          },
          context
        )]
    entities.forEach((entity: unknown) => {
      (destination as { placeEntity: (e: unknown, p?: unknown) => void }).placeEntity(entity, r.position as unknown);
    });
  }
}
