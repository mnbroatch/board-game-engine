import type { BoardgameEngineG, BgioReadonlyState, BgioResolveState } from "./bgio-resolve-types.js";
import type { MoveArgumentsMap } from "../types/move-arguments.js";
import type Move from "../game-factory/move/move.js";
import type { AbstractPickArgument, PreparedMovePayload } from "../types/move-payload.js";
import type { ResolutionContext } from "../types/resolution-context.js";
export type SimulatePreparedArguments = {
    [argumentName: string]: number | AbstractPickArgument | undefined;
};
export default function simulateMove(bgioArguments: BgioReadonlyState | BgioResolveState, payload: PreparedMovePayload<SimulatePreparedArguments> & {
    arguments: SimulatePreparedArguments;
}, context: ResolutionContext & {
    moveInstance: Pick<Move<MoveArgumentsMap>, "doMove">;
}): BoardgameEngineG;
//# sourceMappingURL=simulate-move.d.ts.map