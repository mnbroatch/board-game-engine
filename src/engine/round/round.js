import actionFactory from '../action/action-factory'

const DEBUG = true

export default class Round {
  constructor (rules, game) {
    this.rules = rules
    this.game = game
    this.history = []
    this.actions = rules.actions?.map(actionRule => actionFactory(actionRule, this.game))
  }

  getCorrectAction (actionPayload) {
    for (let action of this.actions) {
      try {
        action.assertIsValid(actionPayload)
        return action
      } catch (e) {
        if (DEBUG) {
          throw e
        }
      }
    }
    throw new Error(`Invalid Action: ${JSON.stringify(actionPayload)}`, )
  }

  doAction (actionPayload) {
    this.getCorrectAction(actionPayload).do(actionPayload, this.game)
    this.afterDoAction()
    this.history.push(actionPayload)
  }

  isOver() {
    return true
  }

  afterDoAction () { }
}
