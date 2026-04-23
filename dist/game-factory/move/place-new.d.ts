import type { MoveDefinition } from "../../types/expanded-game-types.js";
import type { PlaceNewDoPayload } from "../../types/move-payload.js";
import type { BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ResolutionContext } from "../../types/resolution-context.js";
import Move from "./move.js";
export default class PlaceNew extends Move<NonNullable<PlaceNewDoPayload["arguments"]>> {
    do(bgioArguments: BgioResolveState, rule: MoveDefinition, resolvedPayload: PlaceNewDoPayload, context: ResolutionContext): void;
}
//# sourceMappingURL=place-new.d.ts.map