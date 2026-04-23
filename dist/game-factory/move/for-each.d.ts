import type { MoveDefinition } from "../../types/expanded-game-types.js";
import type { ForEachDoPayload } from "../../types/move-payload.js";
import type { BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ResolutionContext } from "../../types/resolution-context.js";
import Move from "./move.js";
export default class ForEach extends Move<NonNullable<ForEachDoPayload["arguments"]>> {
    do(bgioArguments: BgioResolveState, rule: MoveDefinition, resolvedPayload: ForEachDoPayload, context: ResolutionContext): void;
}
//# sourceMappingURL=for-each.d.ts.map