import Condition from '../condition/condition'

export default class BlackoutCondition extends Condition {
  isMet () {
    const grid = this.game.getConfigPath(this.rules.board).grid
    return grid.every(row => row.every(space => !space.isEmpty()))
  }
}
