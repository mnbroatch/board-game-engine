import isMatch from 'lodash/isMatch'
import Condition from '../condition/condition'

export default class RelativeMoveCondition extends Condition {
  isMet (actionPayload) {
    const board = this.game.get(actionPayload.board)
    const pieces = board.getPieces(actionPayload.target)
    return !pieces.filter(this.filterPieces.bind(this)).length
  }

  filterPieces (piece) {
    return this.rules.piece === 'any' || isMatch(piece, this.rules.piece = {})
  }
}
