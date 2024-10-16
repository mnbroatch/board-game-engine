import Board from './board'

export default class Stack extends Board {
  constructor (boardRule, options) {
    super(boardRule, options)
    this.stack = []
  }
}

