import { type BgioReadonlyState } from "./bgio-resolve-types.js";
import type { MoveArgumentBinding } from "../types/expanded-game-types.js";
import type { ResolutionContext } from "../types/resolution-context.js";
export default function getSteps(bgioState: BgioReadonlyState, moveRule: {
    moveType: string;
    arguments?: {
        [argumentName: string]: MoveArgumentBinding | undefined;
    };
}): {
    argName: string;
    getClickable: (() => {
        value: unknown;
        conditions?: import("../index.js").Condition | import("../index.js").Condition[];
        playerChoice?: boolean;
        possibleValues?: unknown[] | undefined;
        resolveAsEntity?: boolean;
        abstract: boolean;
    }[]) | ((context: ResolutionContext) => import("../index.js").EngineEntity[]);
}[];
//# sourceMappingURL=get-steps.d.ts.map