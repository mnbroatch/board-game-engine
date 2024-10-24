import isMatch from 'lodash/isMatch'
import Action from './action'
import PieceGroup from '../piece/piece-group'

export default class MovePieceAction extends Action {
  do (actionPayload) {
    const piece = this.targetPiece(actionPayload)
    const board = this.game.get(actionPayload.board, { player: actionPayload.player })
    const target = this.rules.playerPerspective
      ? board.getTargetAfterRotation(actionPayload.target, this.getRotation(actionPayload.player))
      : actionPayload.target

    board
      .placePiece(
        target,
        piece
      )
  }

  getRotation (player) {
    return (
      player
        && this.game.options.playerCount === 2
        && player.index === 1 
    ) ? 180 : 0
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
    return match instanceof PieceGroup ? match.getOne() : match
  }
}

