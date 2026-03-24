import type { Condition as ConditionRule } from "../../types/bagel-types.js";
import Condition from "./condition.js";
import checkConditions from "../../utils/check-conditions.js";

export default class EveryCondition extends Condition {
  checkCondition (bgioArguments: unknown, rule: unknown, conditionPayload: Record<string, unknown>, context: Record<string, unknown>) {
    const targets = conditionPayload.target as unknown[];
    const results = targets.map((target: unknown) => {
      const loopContext = {
        ...context,
        loopTarget: target
      }

      return checkConditions(
        bgioArguments,
        (rule as { conditions?: ConditionRule[] }).conditions,
        undefined,
        loopContext
      )
    })

    return {
      conditionIsMet: results.every((r: { conditionsAreMet: boolean }) => r.conditionsAreMet),
      results
    }
  }
}
