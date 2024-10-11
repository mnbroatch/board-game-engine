export default class Piece {
  constructor (pieceRule, options) {
    this.pieceRule = pieceRule
    this.player = options.player
  }

  doesRuleMatch (rule) {
    if (rule.player) {
      return rule.player === this.player
    }
    return true
  }
}
