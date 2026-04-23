import type { RemoveEntityDoPayload } from "../../types/move-payload.js";
import type { BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ResolutionContext } from "../../types/resolution-context.js";
import type { MoveDefinition } from "../../types/expanded-game-types.js";
import Move from "./move.js";
export default class RemoveEntity extends Move<NonNullable<RemoveEntityDoPayload["arguments"]>> {
    do(bgioArguments: BgioResolveState, _rule: MoveDefinition, resolvedPayload: RemoveEntityDoPayload, _context: ResolutionContext): void;
}
//# sourceMappingURL=remove-entity.d.ts.map