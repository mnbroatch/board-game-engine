import Round from "./round.js";

export default class SequentialPlayerTurn extends Round {
  constructor(rules, game) {
    super(rules, game);
    this.currentPlayerIndex = 0;
  }

  afterDoAction() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.game.players.length;
  }

  isOver() {
    return this.game.players.every((player) =>
      this.history.some((p) => p === player),
    );
  }
}
