import Action from "./action.js";
import resolveBoard from "../utils/resolve-board.ts";
import resolvePiece from "../utils/resolve-piece.ts";

export default class MovePieceAction extends Action {
  do(actionPayload) {
    const piece = resolvePiece(actionPayload.piece, this.game);
    const board = resolveBoard(actionPayload.board, this.game)
    const target = this.rules.playerPerspective
      ? board.getTargetAfterRotation(
          actionPayload.target,
          this.getRotation(actionPayload.player),
        )
      : actionPayload.target;

    board.placePiece(target, piece);
  }

  getRotation(player) {
    return player && this.game.options.playerCount === 2 && player.index === 1
      ? 180
      : 0;
  }
}
