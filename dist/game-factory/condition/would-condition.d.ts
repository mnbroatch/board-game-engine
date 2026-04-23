import Condition from "./condition.js";
import { type BgioReadonlyState, type BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ConditionContext, ConditionPayload } from "../../types/condition-types.js";
import type { ResolvedConditionRule } from "../../types/resolved-condition-types.js";
export default class WouldCondition extends Condition {
    checkCondition(bgioArguments: BgioReadonlyState | BgioResolveState, rule: ResolvedConditionRule, conditionPayload: ConditionPayload, context: ConditionContext): {
        conditionIsMet: boolean;
        results?: undefined;
    } | {
        results: unknown;
        conditionIsMet: boolean;
    };
}
//# sourceMappingURL=would-condition.d.ts.map