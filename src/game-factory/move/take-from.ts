import type { MoveDefinition, MoveTakeFrom } from "../../types/expanded-game-types.js";
import type { TakeFromDoPayload } from "../../types/move-payload.js";
import type { BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ResolutionContext } from "../../types/resolution-context.js";
import Move from "./move.js";

export default class TakeFrom extends Move<NonNullable<TakeFromDoPayload["arguments"]>> {
  do (
    _bgioArguments: BgioResolveState,
    rule: MoveDefinition,
    resolvedPayload: TakeFromDoPayload,
    _context: ResolutionContext
  ) {
    const r = rule as MoveTakeFrom;
    const { source, destination } = resolvedPayload.arguments;
    destination.placeEntity(
      source.takeOne(r.arguments.source.position)
    );
  }
}
