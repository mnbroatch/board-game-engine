import type { Condition, ConditionWithoutWould } from "../types/expanded-game-types.js";
import type { BgioReadonlyState, BgioResolveState } from "./bgio-resolve-types.js";
import type { CheckConditionsResult, ConditionContext, ConditionPayload } from "../types/condition-types.js";
export type { CheckConditionsResult };
/**
 * Readonly/snapshot: `G` + `ctx` + `playerID` only. Conditions must exclude **top-level** `Would`
 * (nested `Would` inside composites is not enforced by TypeScript).
 */
export default function checkConditions(bgioArguments: BgioReadonlyState, conditions: ConditionWithoutWould | ConditionWithoutWould[] | undefined, payload?: ConditionPayload, context?: ConditionContext): CheckConditionsResult;
/** Full hook / move context; supports any expanded condition, including `Would`. */
export default function checkConditions(bgioArguments: BgioResolveState, conditions?: Condition | Condition[] | undefined, payload?: ConditionPayload, context?: ConditionContext): CheckConditionsResult;
/** Internal callers may hold bgio args as a union; still supports any expanded condition. */
export default function checkConditions(bgioArguments: BgioReadonlyState | BgioResolveState, conditions?: Condition | Condition[] | undefined, payload?: ConditionPayload, context?: ConditionContext): CheckConditionsResult;
//# sourceMappingURL=check-conditions.d.ts.map