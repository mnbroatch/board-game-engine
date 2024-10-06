import isMatch from 'lodash/isMatch'
import Condition from '../condition/condition'

export default class ActionTypeMatchesCondition extends Condition {
  isMet (actionPayload) {
    return actionPayload.type === this.rules.actionType
  }
}
