import matches from 'lodash/matches'
import Condition from '../condition/condition'

export default class PieceMatchesCondition extends Condition {
  isMet (actionPayload) {
    const piece = this.game.getPiece(actionPayload.piece)
    const board = this.game.getPathContaining(piece)
    console.log('board', board)

    if (this.rules.actionRule?.piece && !piece) {
      console.error('no piece found')
      return false
    }

    const toMatch = { ...piece.rule, board }

    if (this.rules.actionRule?.piece && !matches(this.rules.actionRule?.piece)(toMatch)) {
      console.log('this.rules.actionRule?.piece', this.rules.actionRule?.piece)
      console.log('toMatch', toMatch)
      return false
    }

    return true
  }
}
