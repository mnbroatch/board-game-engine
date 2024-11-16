import matches from "lodash/matches.js";
import Condition from "../condition/condition.js";

export default class PieceMatchesCondition extends Condition {
  isMet(actionPayload) {
    const piece = this.game.getPiece(actionPayload.piece);
    const board = this.game.getBoardPathContaining(piece);

    if (this.rules.actionRule?.piece && !piece) {
      console.error("no piece found");
      return false;
    }

    if (this.rules.actionRule?.piece) {
      const matcher = {
        ...this.rules.actionRule.piece,
      };

      // probably going to want to move this
      if (this.rules.actionRule.piece.board) {
        matcher.board = this.game.normalizePath(
          this.rules.actionRule.piece.board,
          { player: this.game.currentRound.currentPlayer },
        );
      }

      const toMatch = { ...piece.rule, board };
      return matches(matcher)(toMatch);
    }

    return true;
  }
}
