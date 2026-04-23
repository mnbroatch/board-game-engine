import Condition from "./condition.js";
import type { BgioReadonlyState, BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ConditionContext, ConditionPayload } from "../../types/condition-types.js";
import type { ResolvedConditionRule } from "../../types/resolved-condition-types.js";
export default class HasLineCondition extends Condition {
    checkCondition(bgioArguments: BgioReadonlyState | BgioResolveState, rule: ResolvedConditionRule, _payload: ConditionPayload, context: ConditionContext): {
        matches: unknown[];
        conditionIsMet: boolean;
    };
}
//# sourceMappingURL=has-line-condition.d.ts.map