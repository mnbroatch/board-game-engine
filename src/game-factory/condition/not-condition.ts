import type { Condition as ConditionRule } from "../../types/bagel-types.js";
import Condition from "./condition.js";
import checkConditions from "../../utils/check-conditions.js";

export default class NotCondition extends Condition {
  checkCondition (bgioArguments: unknown, rule: unknown, payload: Record<string, unknown>, context: Record<string, unknown>) {
    const result = checkConditions(
      bgioArguments,
      (rule as { conditions?: ConditionRule[] }).conditions,
      payload,
      context
    )
    return { conditionIsMet: !result.conditionsAreMet }
  }
}
