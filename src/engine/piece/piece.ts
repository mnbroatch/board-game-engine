import type { PieceRule, PieceRuleMatcher } from "../../types";
import type Player from "../player/player";

interface Options {
  player?: Player;
}

export default class Piece {
  id: string;
  rule: PieceRule;
  player: Player;
  constructor(pieceRule: PieceRule, options: Options) {
    this.id = `${Math.random()}`;
    this.rule = pieceRule;
    if (options.player !== undefined) {
      ({ player: this.player } = options);
    }
  }

  doesRuleMatch(matcher: PieceRuleMatcher): boolean {
    if (matcher.player !== undefined) {
      return matcher.player === this.player;
    }
    return true;
  }
}
