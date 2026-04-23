import type { MoveDefinition } from "../../types/expanded-game-types.js";
import type { SetStateDoPayload } from "../../types/move-payload.js";
import type { BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ResolutionContext } from "../../types/resolution-context.js";
import Move from "./move.js";

// todo: invariant conditions like "is one of the allowed values"
export default class SetState extends Move<NonNullable<SetStateDoPayload["arguments"]>> {
  do (
    _unused: BgioResolveState,
    _rule: MoveDefinition,
    resolvedPayload: SetStateDoPayload,
    _context: ResolutionContext
  ) {
    const { entity, state } = resolvedPayload.arguments;
    entity.state = {
      ...entity.state,
      [state.property]: state.value,
    };
  }
}
