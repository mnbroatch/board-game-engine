import Board from './board'

export default class BoardGroup extends Board {
  constructor (boardRule, options) {
    this.sections = boardRule.sections.map(() => Board.factory(boardRule, options))
  }
}
