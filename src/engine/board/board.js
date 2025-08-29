import Serializable from "../serializable.js";

export default class Board extends Serializable {
  constructor(boardRule, options = {}) {
    super(boardRule, options);
    this.id = `${Math.random()}`;
    this.rule = boardRule;
    if (this.player) {
      this.player = options.player;
    }
  }

  placePiece(target, piece) {}
}
