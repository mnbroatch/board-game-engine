import Condition from "./condition.js";
import entityMatches from '../utils/entity-matches.js'

export default class Is extends Condition {
  checkCondition(bgioArguments, rule, { target }, context) {
    if (this.rule.entity && target !== rule.entity) {
      return {
        target,
        conditionIsMet: false,
      }
    }

    return {
      target,
      conditionIsMet: entityMatches(
        bgioArguments,
        rule.matcher,
        target,
        context
      )
    }
  }
}
