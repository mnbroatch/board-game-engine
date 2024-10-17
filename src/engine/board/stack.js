import Board from './board'

export default class Stack extends Board {
  constructor (boardRule, options) {
    super(boardRule, options)
    this.stack = []
  }

  placePiece (target, piece) {
    if (target) {
      // insert by index?
    } else {
      this.stack.push(piece)
    }
  }
}

