import Action from './action'

export default class SwapAction extends Action {
  do (actionPayload) {
    let piece
    if (actionPayload.from === 'player') {
      piece = this.game.players
        .find(player => player.id === actionPayload.playerId).pieces
        .find(piece => piece.id === actionPayload.pieceId)
        .getOne()
    } else {
      console.log('actionPayload', actionPayload)

    }
    this.game.getLocation(actionPayload.location)
    .placePiece(
      actionPayload.target,
      piece
    )
  }
}
