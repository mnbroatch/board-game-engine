import Condition from "./condition.js";
import checkConditions from "../utils/check-conditions.js";

export default class NotCondition extends Condition {
  checkCondition(bgioArguments, rule, payload, context) {
    const result = checkConditions(
      bgioArguments,
      rule,
      payload,
      context
    )
    return { conditionIsMet: !result.conditionsAreMet }
  }
}
