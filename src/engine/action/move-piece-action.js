import isMatch from 'lodash/isMatch'
import Action from './action'
import PieceGroup from '../piece/piece-group'

export default class MovePieceAction extends Action {
  do (actionPayload) {
    const piece = this.targetPiece(actionPayload)

    this.getBoard(actionPayload)
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
    let x = match instanceof PieceGroup ? match.getOne() : match
    if (!x) {
      console.log('==============')
      console.log('matcher', matcher)
      console.log('match', match)
      console.log('match.getOne', match.getOne)
      console.log('actionPayload', actionPayload)
      console.log('match instanceof PieceGroup ', match instanceof PieceGroup )
    }
    return x
  }
}

