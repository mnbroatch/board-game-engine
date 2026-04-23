import type { MoveDefinition } from "../../types/expanded-game-types.js";
import type { MovePayload } from "../../types/move-payload.js";
import type { MoveArgumentsMap } from "../../types/move-arguments.js";
import type { BgioResolveState } from "../../utils/bgio-resolve-types.js";
import Move from "./move.js";
import { type DoMovesContext } from "../../utils/do-moves.js";
export default class SetActivePlayers extends Move<MoveArgumentsMap> {
    do(bgioArguments: BgioResolveState, rule: MoveDefinition, _resolvedPayload: MovePayload<MoveArgumentsMap>, context: DoMovesContext): void;
}
//# sourceMappingURL=set-active-players.d.ts.map