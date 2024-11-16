import Condition from "../condition/condition.js";

export default class IsValidPlayerCondition extends Condition {
  isMet(actionPayload) {
    return this.game.currentRound.currentPlayer.id === actionPayload.playerId;
  }
}
