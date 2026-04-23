import Condition from "./condition.js";
import { type BgioReadonlyState, type BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ConditionContext, ConditionPayload } from "../../types/condition-types.js";
import type { ResolvedConditionRule } from "../../types/resolved-condition-types.js";
export default class Position extends Condition {
    checkCondition(bgioArguments: BgioReadonlyState | BgioResolveState, rule: ResolvedConditionRule, conditionPayload: ConditionPayload, _newContext: ConditionContext): {
        conditionIsMet: boolean;
    };
}
//# sourceMappingURL=position-condition.d.ts.map