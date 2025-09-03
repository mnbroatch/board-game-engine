import Action from "./action.js";

export default class SelectPieceAction extends Action {
  constructor(actionPayload, game) {
    super(actionPayload, game);
  }
  do(actionPayload) {
    let piece;
    if (actionPayload.piece?.id) {
      piece = this.game.getPiece({
        id: actionPayload.piece?.id,
      });
    } else if (actionPayload.from === "player") {
      piece = this.game.players
        .find((player) => player.id === actionPayload.playerId)
        .pieces.find((piece) => piece.name === actionPayload.piece.name)
        .getOne();
    }
    this.game.context.selectedPiece = piece;

    // do the "then"
  }
}
