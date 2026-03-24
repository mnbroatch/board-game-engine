import conditionFactory from "../game-factory/condition/condition-factory.js";
import type { Condition as ConditionRule } from "../types/bagel-types.js";

export default function checkConditions (
  bgioArguments: unknown,
  conditions: ConditionRule[] = [],
  payload: Record<string, unknown> = {},
  context: Record<string, unknown> = {}
) {
  const results: unknown[] = [];
  let failedAt: unknown;
  for (const conditionRule of conditions) {
    const result = conditionFactory(conditionRule as ConditionRule)!
      .check(bgioArguments, payload, context);
    if (!(result as { conditionIsMet: boolean }).conditionIsMet) {
      failedAt = conditionRule;
      break;
    } else {
      results.push(result);
    }
  }

  return {
    results,
    failedAt,
    conditionsAreMet: results.length === conditions.length,
  };
}
