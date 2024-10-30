import Action from './action'

export default class SelectPieceAction extends Action {
  constructor (actionPayload, game) {
    super(actionPayload, game)
  }
  do (actionPayload) {
    let piece
    console.log('123', 123)
    if (actionPayload.from === 'player') {
      piece = this.game.players
        .find(player => player.id === actionPayload.playerId).pieces
        .find(piece => piece.id === actionPayload.piece.id)
        .getOne()
    }

    this.context.selectedPiece = piece

    actionPayload.then.forEach()
    this.currentRound.doAction(this.expandActionPayload())

    // do the "then"

  }
}
