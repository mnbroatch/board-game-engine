import type { MoveDefinition } from "../../types/expanded-game-types.js";
import type { SetStateDoPayload } from "../../types/move-payload.js";
import type { BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ResolutionContext } from "../../types/resolution-context.js";
import Move from "./move.js";
export default class SetState extends Move<NonNullable<SetStateDoPayload["arguments"]>> {
    do(_unused: BgioResolveState, _rule: MoveDefinition, resolvedPayload: SetStateDoPayload, _context: ResolutionContext): void;
}
//# sourceMappingURL=set-state.d.ts.map