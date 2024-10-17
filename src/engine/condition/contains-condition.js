import isMatch from 'lodash/isMatch'
import Condition from '../condition/condition'

export default class ContainsCondition extends Condition {
  isMet (actionPayload) {
    const board = this.game.get(actionPayload.board)
    const pieces = board.getPieces(actionPayload.target)
    return !!pieces.filter(filterPieces).length
  }

  filterPieces (piece) {
    return this.rules.piece === 'any' || isMatch(piece, this.rules.piece = {})
  }
}
