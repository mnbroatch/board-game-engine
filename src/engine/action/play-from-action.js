import Action from './action'

export default class PlayFromAction extends Action {
  do (actionPayload) {
    console.log('123', 123)
    console.log('this.game.getLocation(actionPayload.location)', this.game.getLocation(actionPayload.location))
  }
}
