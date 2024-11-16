import Condition from "../condition/condition.js";

export default class BingoCondition extends Condition {
  isMet() {
    const grid = this.game.get(this.rules.board).grid;

    // TODO: handle rectangles in addition to squares
    const size = grid.length;

    // Check rows
    for (let i = 0; i < size; i++) {
      if (this.checkLine(grid[i])) {
        return true;
      }
    }

    // Check columns
    for (let i = 0; i < size; i++) {
      const column = [];
      for (let j = 0; j < size; j++) {
        column.push(grid[j][i]);
      }
      if (this.checkLine(column)) {
        return true;
      }
    }

    // Check diagonals
    const diagonal1 = [];
    const diagonal2 = [];
    for (let i = 0; i < size; i++) {
      diagonal1.push(grid[i][i]);
      diagonal2.push(grid[i][size - 1 - i]);
    }
    if (this.checkLine(diagonal1) || this.checkLine(diagonal2)) {
      return true;
    }

    return false;
  }

  checkLine(line) {
    return line.every((space) =>
      space.pieces.some((piece) => {
        return piece.doesRuleMatch(this.rules.piece);
      }),
    );
  }
}
