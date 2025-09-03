import conditionFactory from '../condition/condition-factory.js'

export default class Action {
  constructor (rules, game) {
    this.game = game
    this.rules = rules
    this.id = `${Math.random()}`

    const invariantConditionRules = [
      { type: 'actionTypeMatches', actionRule: this.rules },
      { type: 'pieceMatches', actionRule: this.rules },
      { type: 'isValidPlayer' }
    ]

    this.conditions = [
      ...invariantConditionRules,
      ...(this.rules.conditions || [])
    ].map((conditionRule) => conditionFactory(conditionRule, game))
  }

  assertIsValid (actionPayload) {
    const unmetConditions = this.conditions.filter(
      (condition) => !condition.isMet(actionPayload)
    )
    if (unmetConditions.length) {
      console.log('==================')
      console.log('unmetConditions', unmetConditions)
      console.log('actionPayload', actionPayload)
      throw new Error('conditions not met ^')
    }
  }

  do () {}
}
