import Condition from "../condition/condition.js";
import resolveBoard from "../utils/resolve-board.ts";

export default class BlackoutCondition extends Condition {
  isMet() {
    const grid = resolveBoard(this.rules.boardPath, this.game).grid;
    return grid.every((row) => row.every((space) => !space.isEmpty()));
  }
}
