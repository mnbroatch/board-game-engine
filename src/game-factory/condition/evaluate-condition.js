import _matches from "lodash/matches.js";
import Condition from "../condition/condition.js";
import resolveExpression from "../utils/resolve-expression.js";

export default class Evaluate extends Condition {
  checkCondition(bgioArguments, rule, payload, context) {
    const newContext = { ...context }
    if (payload?.target) {
      newContext.target = payload.target
    }
    const result = resolveExpression(
      bgioArguments,
      rule,
      newContext
    )
    return { result, conditionIsMet: !!result }
  }
}
