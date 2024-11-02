import isMatch from 'lodash/isMatch'
import Condition from '../condition/condition'

export default class DoesNotContainCondition extends Condition {
  isMet (actionPayload) {
    const board = this.game.get(actionPayload.board)
    if (!board) {
      console.log('111actionPayload', actionPayload)
    }
    const pieces = board.getPieces(actionPayload.target)
    return !pieces.filter(this.filterPieces.bind(this)).length
  }

  filterPieces (piece) {
    return this.rules.piece === 'any' || isMatch(piece, this.rules.piece = {})
  }
}
