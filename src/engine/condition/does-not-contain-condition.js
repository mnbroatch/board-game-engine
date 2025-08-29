import matches from "lodash/matches.js";
import Condition from "../condition/condition.js";
import resolveBoard from "../utils/resolve-board.ts";

export default class DoesNotContainCondition extends Condition {
  isMet(actionPayload) {
    const board = resolveBoard(actionPayload.board, this.game);
    const pieces = board.getPieces(actionPayload.target);
    return !pieces.filter(this.filterPieces.bind(this)).length;
  }

  filterPieces(piece) {
    return this.rules.piece === "any" || matches(piece, this.rules.piece || {});
  }
}
