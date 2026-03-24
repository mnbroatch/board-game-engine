import conditionFactory from "../game-factory/condition/condition-factory.js";
import type { Condition as ConditionRule } from "../types/bagel-types.js";

export default function findMetCondition (
  bgioArguments: unknown,
  conditions: ConditionRule[] = [],
  payload: Record<string, unknown>,
  context: Record<string, unknown>,
) {
  let success: { conditionRule: unknown; [k: string]: unknown } | undefined;
  for (const conditionRule of conditions) {
    const result = conditionFactory(conditionRule as ConditionRule)!
      .check(bgioArguments, payload, context);
    if ((result as { conditionIsMet: boolean }).conditionIsMet) {
      success = {
        ...result as object,
        conditionRule,
      };
      break;
    }
  }
  return success;
}
