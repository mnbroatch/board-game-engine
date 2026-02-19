import Condition from "./condition.js";
import gridContainsSequence from "../utils/grid-contains-sequence.js";

export default class HasLineCondition extends Condition {
  checkCondition(bgioArguments, rule, payload, context) {
    const { matches } = gridContainsSequence(
      bgioArguments,
      payload.target,
      rule.sequence,
      context
    );
    return { matches, conditionIsMet: !!matches.length };
  }
}
