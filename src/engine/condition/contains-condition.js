import isMatch from 'lodash/isMatch'
import Condition from '../condition/condition'

export default class ContainsCondition extends Condition {
  isMet (actionPayload) {
    const location = this.game.getLocation(actionPayload.location)
    const pieces = location.getPieces(actionPayload.target)
    return !!pieces.filter(filterPieces).length
  }

  filterPieces (piece) {
    return this.rules.piece === 'any' || isMatch(piece, this.rules.piece = {})
  }
}
