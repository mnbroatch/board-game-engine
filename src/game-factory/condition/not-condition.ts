import type { Condition as ConditionRule } from "../../types/expanded-game-types.js";
import Condition from "./condition.js";
import checkConditions from "../../utils/check-conditions.js";
import type { BgioReadonlyState, BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ConditionContext, ConditionPayload } from "../../types/condition-types.js";
import type { ResolvedConditionRule } from "../../types/resolved-condition-types.js";

export default class NotCondition extends Condition {
  checkCondition (bgioArguments: BgioReadonlyState | BgioResolveState, rule: ResolvedConditionRule, payload: ConditionPayload, context: ConditionContext) {
    const result = checkConditions(
      bgioArguments,
      (rule as { conditions?: ConditionRule[] }).conditions,
      payload,
      context
    )
    return { conditionIsMet: !result.conditionsAreMet }
  }
}
