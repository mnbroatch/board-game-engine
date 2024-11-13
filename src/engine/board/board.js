export default class Board {
  constructor (boardRule, options = {}) {
    this.id = `${Math.random()}`
    this.rule = boardRule
    if (this.player) {
      this.player = options.player
    }
  }

  placePiece (target, piece) {
  }
}
