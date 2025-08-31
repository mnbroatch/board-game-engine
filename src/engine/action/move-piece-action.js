import Action from "./action.js";
import resolveBoard from "../utils/resolve-board.ts";
import resolvePiece from "../utils/resolve-piece.ts";

export default class MovePieceAction extends Action {
  do(actionPayload) {
    const piece = resolvePiece(actionPayload.piece, this.game);
    const board = resolveBoard(actionPayload.board, this.game)
    board.placePiece(actionPayload.target, piece);
  }
}
