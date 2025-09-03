import Action from "./action.js";

export default class SwapAction extends Action {
  do(actionPayload) {
    let piece;
    if (actionPayload.from === "player") {
      piece = this.game.players
        .find((player) => player.id === actionPayload.playerId)
        .pieces.find((piece) => piece.name === actionPayload.piece.name)
        .getOne();
    }
    this.game.get(actionPayload.board).placePiece(actionPayload.target, piece);
  }
}
