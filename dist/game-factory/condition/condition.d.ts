import type { BgioReadonlyState, BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ConditionCheckResult, ConditionContext, ConditionPayload } from "../../types/condition-types.js";
import type { ResolvedConditionRule } from "../../types/resolved-condition-types.js";
import type { Condition as ConditionRule } from "../../types/expanded-game-types.js";
export default abstract class Condition {
    rule: ConditionRule;
    constructor(rule: ConditionRule);
    check(bgioArguments: BgioReadonlyState | BgioResolveState, payload: ConditionPayload, context: ConditionContext): ConditionCheckResult;
    abstract checkCondition(bgioArguments: BgioReadonlyState | BgioResolveState, rule: ResolvedConditionRule, conditionPayload: ConditionPayload, newContext: ConditionContext): ConditionCheckResult;
    isMet(bgioArguments: BgioReadonlyState | BgioResolveState, payload?: ConditionPayload, context?: ConditionContext): boolean;
}
//# sourceMappingURL=condition.d.ts.map