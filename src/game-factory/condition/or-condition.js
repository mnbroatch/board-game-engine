import Condition from "./condition.js";
import findMetCondition from "../../utils/find-met-condition.js";

export default class Or extends Condition {
  checkCondition(bgioArguments, rule, payload, context) {
    const result = findMetCondition(
      bgioArguments,
      rule,
      payload,
      context
    )
    console.log('result', result)
    return { conditionIsMet: !!result }
  }
}
