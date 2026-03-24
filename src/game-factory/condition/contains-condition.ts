import _matches from "lodash/matches.js";
import type { Condition as ConditionRule } from "../../types/bagel-types.js";
import Condition from "../condition/condition.js";
import checkConditions from "../../utils/check-conditions.js";

export default class ContainsCondition extends Condition {
  checkCondition (bgioArguments: unknown, rule: unknown, payload: Record<string, unknown>, context: Record<string, unknown>) {
    const target = payload.target as { entities?: unknown[]; spaces?: unknown[] } | undefined;
    if (!target) {
      return { matches: [], conditionIsMet: false }
    } else {
      const candidates = target.entities ?? target.spaces
      const matches = candidates?.filter((entity: unknown) => checkConditions(
        bgioArguments,
        (rule as { conditions?: ConditionRule[] }).conditions,
        { target: entity },
        context
      ).conditionsAreMet) ?? []
      return { matches, conditionIsMet: !!matches.length }
    }
  }
}
