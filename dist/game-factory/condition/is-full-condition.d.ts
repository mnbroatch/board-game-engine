import Condition from "./condition.js";
import type { BgioReadonlyState, BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ConditionContext, ConditionPayload } from "../../types/condition-types.js";
import type { ResolvedConditionRule } from "../../types/resolved-condition-types.js";
export default class IsFull extends Condition {
    checkCondition(_bgioArguments: BgioReadonlyState | BgioResolveState, rule: ResolvedConditionRule, _payload: ConditionPayload, _context: ConditionContext): {
        conditionIsMet: boolean;
    };
}
//# sourceMappingURL=is-full-condition.d.ts.map