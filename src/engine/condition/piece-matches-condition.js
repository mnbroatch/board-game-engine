import isMatch from 'lodash/isMatch'
import Condition from '../condition/condition'

export default class PieceMatchesCondition extends Condition {
  isMet (actionPayload) {
    console.log('---------------')
    console.log('this.rules.piece', this.rules.piece)
    console.log('actionPayload.piece', actionPayload.piece)
    return this.rules.piece
      ? isMatch(actionPayload.piece, this.rules.piece)
      : true
  }
}
