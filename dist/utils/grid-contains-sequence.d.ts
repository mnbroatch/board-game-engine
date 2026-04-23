import type { Condition } from "../types/expanded-game-types.js";
import type { ResolutionContext } from "../types/resolution-context.js";
import type { BgioReadonlyState, BgioResolveState } from "./bgio-resolve-types.js";
import type Grid from "../game-factory/space-group/grid.js";
export type SequenceChunk = {
    count?: number;
    minCount?: number;
    maxCount?: number;
    conditions?: Condition[];
};
export type GridLike = Grid;
export default function gridContainsSequence(bgioArguments: BgioReadonlyState | BgioResolveState, grid: GridLike, sequencePattern: SequenceChunk[], context: ResolutionContext): unknown;
//# sourceMappingURL=grid-contains-sequence.d.ts.map