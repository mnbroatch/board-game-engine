import Condition from "../condition/condition.js";
import type { BgioReadonlyState, BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ConditionContext, ConditionPayload } from "../../types/condition-types.js";
import type { EngineEntity } from "../../types/runtime-entity.js";
import type { ResolvedConditionRule } from "../../types/resolved-condition-types.js";
export default class ContainsCondition extends Condition {
    checkCondition(bgioArguments: BgioReadonlyState | BgioResolveState, rule: ResolvedConditionRule, payload: ConditionPayload, context: ConditionContext): {
        matches: EngineEntity<import("../../index.js").DefaultEngineEntityAttributes, import("../../index.js").DefaultEngineEntityState>[];
        conditionIsMet: boolean;
    };
}
//# sourceMappingURL=contains-condition.d.ts.map