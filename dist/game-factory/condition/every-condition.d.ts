import Condition from "./condition.js";
import type { BgioReadonlyState, BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ConditionContext, ConditionPayload } from "../../types/condition-types.js";
import type { ResolvedConditionRule } from "../../types/resolved-condition-types.js";
export default class EveryCondition extends Condition {
    checkCondition(bgioArguments: BgioReadonlyState | BgioResolveState, rule: ResolvedConditionRule, conditionPayload: ConditionPayload, context: ConditionContext): {
        conditionIsMet: boolean;
        results: import("../../utils/check-conditions.js").CheckConditionsResult[];
    };
}
//# sourceMappingURL=every-condition.d.ts.map