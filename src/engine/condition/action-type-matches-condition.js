import Condition from "../condition/condition.js";

export default class ActionTypeMatchesCondition extends Condition {
  isMet(actionPayload) {
    return actionPayload.actionRule?.type === this.rules.actionType;
  }
}
