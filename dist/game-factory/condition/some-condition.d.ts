import Condition from "./condition.js";
import type { BgioReadonlyState, BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ConditionContext, ConditionPayload } from "../../types/condition-types.js";
import type { EngineEntity } from "../../types/runtime-entity.js";
import type { ResolvedConditionRule } from "../../types/resolved-condition-types.js";
export default class SomeCondition extends Condition {
    checkCondition(bgioArguments: BgioReadonlyState | BgioResolveState, rule: ResolvedConditionRule, conditionPayload: ConditionPayload, context: ConditionContext): {
        conditionIsMet: boolean;
        result: EngineEntity | undefined;
    };
}
//# sourceMappingURL=some-condition.d.ts.map