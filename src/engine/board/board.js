export default class Board {
  constructor (boardRule, options = {}) {
    this.path = boardRule.path
    this.player = options.player
  }

  placePiece (target, piece) {
  }
}
