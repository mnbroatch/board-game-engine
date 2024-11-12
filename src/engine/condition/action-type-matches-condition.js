import Condition from '../condition/condition'

export default class ActionTypeMatchesCondition extends Condition {
  isMet (actionPayload) {
    return actionPayload.actionRule?.type === this.rules.actionType
  }
}
