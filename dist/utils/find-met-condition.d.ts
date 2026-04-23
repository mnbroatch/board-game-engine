import type { Condition } from "../types/expanded-game-types.js";
import type { BgioReadonlyState, BgioResolveState } from "./bgio-resolve-types.js";
import type { ConditionContext, ConditionPayload } from "../types/condition-types.js";
export default function findMetCondition(bgioArguments: BgioReadonlyState | BgioResolveState, conditions: Condition[] | undefined, payload: ConditionPayload, context: ConditionContext): {
    [k: string]: unknown;
    conditionRule: unknown;
} | undefined;
//# sourceMappingURL=find-met-condition.d.ts.map