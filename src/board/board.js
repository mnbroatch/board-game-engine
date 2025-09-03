export default class Board {
  constructor (boardRule, options = {}) {
    this.rule = boardRule
    this.id = `${Math.random()}`
    if (this.player) {
      this.player = options.player
    }
  }

  placePiece (target, piece) {}
}
