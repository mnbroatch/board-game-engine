import type { MoveDefinition } from "../../types/expanded-game-types.js";
import type { MoveEntityDoPayload } from "../../types/move-payload.js";
import type { BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ResolutionContext } from "../../types/resolution-context.js";
import Move from "./move.js";
export default class MoveEntity extends Move<NonNullable<MoveEntityDoPayload["arguments"]>> {
    do(bgioArguments: BgioResolveState, rule: MoveDefinition, resolvedPayload: MoveEntityDoPayload, _context: ResolutionContext): void;
}
//# sourceMappingURL=move-entity.d.ts.map