import Board from "./board.js";

export default class BoardGroup extends Board {
  constructor(boardRule, options) {
    this.sections = boardRule.sections.map(() =>
      Board.factory(boardRule, options),
    );
  }
}
