import matches from "lodash/matches.js";
import Condition from "../condition/condition.js";
import resolvePiece from "../utils/resolve-piece.ts";

export default class PieceMatchesCondition extends Condition {
  isMet(actionPayload) {
    const piece = resolvePiece(actionPayload.piece, this.game);

    if (this.rules.actionRule?.piece && !piece) {
      console.error("no piece found");
      return false;
    }

    if (this.rules.actionRule?.piece) {
      const matcher = {
        ...this.rules.actionRule.piece,
      };
      return matches(matcher)(piece.rule);
    }

    return true;
  }
}
