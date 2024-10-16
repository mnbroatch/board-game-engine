import isMatch from 'lodash/isMatch'
import Action from './action'
import PieceGroup from '../piece/piece-group'

export default class MovePieceAction extends Action {
  do (actionPayload) {
    const piece = this.targetPiece(actionPayload)
    this.game.getConfigPath(actionPayload.board)
      .placePiece(
        actionPayload.target,
        piece
      )
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
    console.log('match', match)
    return match instanceof PieceGroup ? match.getOne() : match
  }
}

