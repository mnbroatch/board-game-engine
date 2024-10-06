import isMatch from 'lodash/isMatch'
import Condition from '../condition/condition'

export default class IsValidPlayerCondition extends Condition {
  isMet (actionPayload) {
    return this.game.currentRound.currentPlayer.id === actionPayload.playerId
  }
}
