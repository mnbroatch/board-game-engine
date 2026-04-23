import _matches from "lodash/matches.js";
import Condition from "../condition/condition.js";
import resolveExpression from "../../utils/resolve-expression.js";
import type { BgioReadonlyState, BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ConditionContext, ConditionPayload } from "../../types/condition-types.js";
import type { MoveArgumentsState } from "../../types/resolution-context.js";
import type { ResolvedConditionEvaluate, ResolvedConditionRule } from "../../types/resolved-condition-types.js";

export default class Evaluate extends Condition {
  checkCondition (bgioArguments: BgioReadonlyState | BgioResolveState, rule: ResolvedConditionRule, payload: ConditionPayload, context: ConditionContext) {
    const newContext = { ...context }
    if (payload?.target) {
      newContext.target = payload.target
    }
    const result = resolveExpression(
      bgioArguments,
      rule as ResolvedConditionEvaluate as { expression: string; arguments?: MoveArgumentsState },
      newContext
    )
    return { result, conditionIsMet: !!result }
  }
}
