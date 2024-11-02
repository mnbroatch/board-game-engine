export default class Board {
  constructor (boardRule, options = {}) {
    this.id = Math.random()
    this.rule = boardRule
    this.player = options.player
  }

  placePiece (target, piece) {
  }
}
