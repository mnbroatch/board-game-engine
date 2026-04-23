import Condition from "./condition.js";
import type { BgioReadonlyState, BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ConditionContext, ConditionPayload } from "../../types/condition-types.js";
import type { ResolvedConditionRule } from "../../types/resolved-condition-types.js";
export default class NoPossibleMoves extends Condition {
    checkCondition(bgioArguments: BgioReadonlyState | BgioResolveState, _unused: ResolvedConditionRule, _payload: ConditionPayload, context: ConditionContext): {
        conditionIsMet: boolean;
    };
}
//# sourceMappingURL=no-possible-moves-condition.d.ts.map