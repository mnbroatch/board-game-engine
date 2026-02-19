import Condition from "./condition.js";

export default class IsFull extends Condition {
  checkCondition(bgioArguments, rule, payload, context) {
    return {
      conditionIsMet: payload.target.spaces.every(space => space.entities.length)
    };
  }
}
