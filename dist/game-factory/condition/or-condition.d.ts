import Condition from "./condition.js";
import type { BgioReadonlyState, BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ConditionContext, ConditionPayload } from "../../types/condition-types.js";
import type { ResolvedConditionRule } from "../../types/resolved-condition-types.js";
export default class Or extends Condition {
    checkCondition(bgioArguments: BgioReadonlyState | BgioResolveState, rule: ResolvedConditionRule, payload: ConditionPayload, context: ConditionContext): {
        conditionIsMet: boolean;
    };
}
//# sourceMappingURL=or-condition.d.ts.map