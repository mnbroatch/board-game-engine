import isMatch from 'lodash/isMatch'
import Action from './action'
import PieceGroup from '../piece/piece-group'

export default class MovePieceAction extends Action {
  do (actionPayload) {
    const piece = this.targetPiece(actionPayload)
    console.log('piece', piece)

    this.game.get(actionPayload.board, { player: actionPayload.player })
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
    if (actionPayload.piece.player) {
      matcher.player = {
        id: actionPayload.piece.player.id
      }
    }
    const match = this.game.pieces.find(piece => isMatch(piece, matcher))
    let x = match instanceof PieceGroup ? match.getOne() : match
    if (!x) {
      console.log('==============')
      console.log('matcher', matcher)
      console.log('match', match)
      console.log('actionPayload', actionPayload)
      console.log('match instanceof PieceGroup ', match instanceof PieceGroup )
    }
    return x
  }
}

