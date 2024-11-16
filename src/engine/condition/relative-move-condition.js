import matches from "lodash/matches.js";
import Condition from "../condition/condition.js";

export default class RelativeMoveCondition extends Condition {
  isMet(actionPayload) {
    const board = this.game.get(actionPayload.board);
    const pieces = board.getPieces(actionPayload.target);
    return !pieces.filter(this.filterPieces.bind(this)).length;
  }

  filterPieces(piece) {
    return (
      this.rules.piece === "any" || matches(piece, (this.rules.piece = {}))
    );
  }
}
