import Action from './action'

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
      name: actionPayload.piece.name,
    }
    if (actionPayload.piece.player) {
      matcher.player = {
        id: actionPayload.piece.player.id
      }
    }
    return this.game.getPiece(matcher)
  }
}

