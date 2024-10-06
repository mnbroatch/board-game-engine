import Round from './round'

export default class SequentialPlayerTurn extends Round {
  constructor (rules, game, options) {
    super(rules, game)
    this.currentPlayer = this.game.currentRound?.currentPlayer || this.game.players[0]
  }

  afterDoAction () {
    this.currentPlayer = this.game.players[(this.game.players.indexOf(this.currentPlayer) + 1) % this.game.players.length]
  }

  isOver() {
    return this.game.players.every(player => this.history.some(p => p === player))
  }
}

