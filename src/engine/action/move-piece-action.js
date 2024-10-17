import isMatch from 'lodash/isMatch'
import Action from './action'
import PieceGroup from '../piece/piece-group'

export default class MovePieceAction extends Action {
  do (actionPayload) {
    try {
      const piece = this.targetPiece(actionPayload)
      this.getBoard(actionPayload)
        .placePiece(
          actionPayload.target,
          piece
        )
    } catch (e) {
      console.log('================')
      const piece = this.targetPiece(actionPayload)
      console.log('piece', piece)
      console.log('actionPayload', actionPayload)
      console.log('this.game', this.game)
      throw e
    }
  }

  // move this?
  // add invariant condition for taking from a depleted pile
  targetPiece (actionPayload) {
    const matcher = {
      id: actionPayload.piece.id,
    }
    if (actionPayload.playerId) {
      matcher.player = {
        id: actionPayload.playerId
      }
    }
    const match = this.game.pieces.find(piece => isMatch(piece, matcher))
    return match instanceof PieceGroup ? match.getOne() : match
  }
}

