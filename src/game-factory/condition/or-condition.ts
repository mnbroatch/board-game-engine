import type { Condition as ConditionRule } from "../../types/bagel-types.js";
import Condition from "./condition.js";
import findMetCondition from "../../utils/find-met-condition.js";

export default class Or extends Condition {
  checkCondition (bgioArguments: unknown, rule: unknown, payload: Record<string, unknown>, context: Record<string, unknown>) {
    const result = findMetCondition(
      bgioArguments,
      (rule as { conditions?: ConditionRule[] }).conditions,
      payload,
      context
    )
    return { conditionIsMet: !!result }
  }
}
