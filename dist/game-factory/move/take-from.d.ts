import type { MoveDefinition } from "../../types/expanded-game-types.js";
import type { TakeFromDoPayload } from "../../types/move-payload.js";
import type { BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ResolutionContext } from "../../types/resolution-context.js";
import Move from "./move.js";
export default class TakeFrom extends Move<NonNullable<TakeFromDoPayload["arguments"]>> {
    do(_bgioArguments: BgioResolveState, rule: MoveDefinition, resolvedPayload: TakeFromDoPayload, _context: ResolutionContext): void;
}
//# sourceMappingURL=take-from.d.ts.map