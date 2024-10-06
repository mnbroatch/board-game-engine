import Board from './board'

export default class Stack extends Board {
  constructor (boardRule) {
    super(boardRule)
    this.stack = []
  }
}

