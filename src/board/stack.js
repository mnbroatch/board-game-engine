import Board from "./board.js";

export default class Stack extends Board {
  constructor(boardRule, options) {
    super(boardRule, options);
    this.stack = [];
  }

  placePiece(target, piece) {
    if (target) {
      // insert by index?
    } else {
      this.stack.push(piece);
    }
  }
}
