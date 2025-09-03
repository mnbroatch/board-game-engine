import Condition from "../condition/condition.js";

export default class IsValidPlayerCondition extends Condition {
  isMet(actionPayload) {
    return this.game.players[this.game.currentRound.currentPlayerIndex].id === actionPayload.playerId;
  }
}
