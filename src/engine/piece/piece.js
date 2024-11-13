export default class Piece {
  constructor (pieceRule, options) {
    this.id = `${Math.random()}`
    this.rule = pieceRule
    if (options.player) {
      this.player = options.player
    }
  }

  doesRuleMatch (rule) {
    if (rule.player) {
      return rule.player === this.player
    }
    return true
  }
}
