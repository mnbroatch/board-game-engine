import Condition from "./condition.js";
import checkConditions from "../utils/check-conditions.js";

export default class SomeCondition extends Condition {
  checkCondition(bgioArguments, rule, { target: targets }, context) {
    const result = targets.find((target) => {
      const loopContext = {
        ...context,
        loopTarget: target
      }
      return checkConditions(
        bgioArguments,
        rule,
        undefined,
        loopContext
      ).conditionsAreMet
    })

    return {
      conditionIsMet: !!result,
      result
    }
  }
}
