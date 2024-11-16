import Condition from "../condition/condition.js";

export default class BlackoutCondition extends Condition {
  isMet() {
    const grid = this.game.get(this.rules.board).grid;
    return grid.every((row) => row.every((space) => !space.isEmpty()));
  }
}
