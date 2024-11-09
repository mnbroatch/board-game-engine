import isMatch from 'lodash/isMatch'
import Condition from '../condition/condition'

export default class PieceMatchesCondition extends Condition {
  isMet (actionPayload) {
    const piece = this.game.getPiece(actionPayload.piece)
    console.log('piece', piece)

    if (actionPayload.piece === 'string') {
      console.log('123123123', 123123123)
    }

    if (this.rules.actionRule?.piece && !actionPayload.piece) {
      return false
    }

    if (this.rules.actionRule?.piece && !isMatch(actionPayload.piece, this.rules.actionRule?.piece)) {
      console.log('actionPayload.piece', actionPayload.piece)
      console.log('this.rules.actionRule.piece', this.rules.actionRule.piece)
      return false
    }

    return true
  }
}
