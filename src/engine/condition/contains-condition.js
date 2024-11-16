import matches from "lodash/matches.js";
import Condition from "../condition/condition.js";

export default class ContainsCondition extends Condition {
  isMet(actionPayload) {
    const board = this.game.get(actionPayload.board);
    const pieces = board.getPieces(actionPayload.target);
    return !!pieces.filter(filterPieces).length;
  }

  filterPieces(piece) {
    return this.rules.piece === "any" || matches(this.rules.piece)(piece);
  }
}
