import isMatch from 'lodash/isMatch'
import Condition from '../condition/condition'

export default class PieceMatchesCondition extends Condition {
  isMet (actionPayload) {
    console.log('1111actionPayload', actionPayload)
    console.log('11111this.rules.piece', this.rules.piece)
    if (actionPayload.actionRule?.piece === 'string') {
      console.log('123123123', 123123123)
    }

    if (actionPayload.actionRule?.piece && !actionPayload.actionRule?.piece) {
      return false
    }

    if (actionPayload.actionRule?.piece && !isMatch(actionPayload.piece, this.rules.piece)) {
      return false
    }

    return true
  }
}
