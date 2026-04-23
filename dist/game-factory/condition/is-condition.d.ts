import Condition from "./condition.js";
import type { BgioReadonlyState, BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ConditionContext, ConditionPayload } from "../../types/condition-types.js";
import type { ResolvedConditionRule } from "../../types/resolved-condition-types.js";
export default class Is extends Condition {
    checkCondition(bgioArguments: BgioReadonlyState | BgioResolveState, rule: ResolvedConditionRule, { target }: ConditionPayload, context: ConditionContext): {
        target: import("../../index.js").EngineEntity | import("../../index.js").EngineEntity[] | undefined;
        conditionIsMet: boolean;
    };
}
//# sourceMappingURL=is-condition.d.ts.map