import _matches from "lodash/matches.js";
import Condition from "../condition/condition.js";
import resolveExpression from "../../utils/resolve-expression.js";
import type { BgioResolveState } from "../../utils/bgio-resolve-types.js";

export default class Evaluate extends Condition {
  checkCondition (bgioArguments: unknown, rule: unknown, payload: Record<string, unknown>, context: Record<string, unknown>) {
    const newContext = { ...context }
    if (payload?.target) {
      newContext.target = payload.target
    }
    const result = resolveExpression(
      bgioArguments as BgioResolveState,
      rule as { expression: string; arguments?: unknown },
      newContext
    )
    return { result, conditionIsMet: !!result }
  }
}
