import conditionFactory from '../condition/condition-factory'
import isEqual from 'lodash/isEqual'

export default class Action {
  constructor (rules, game) {
    this.game = game
    this.rules = rules

    const invariantConditionRules = [
      { type: 'actionTypeMatches', actionType: this.rules.type },
      { type: 'pieceMatches', piece: this.rules.piece },
      { type: 'isValidPlayer' }
    ]

    this.conditions = [
      ...invariantConditionRules,
      ...(this.rules.conditions || [])
    ]
      .map(conditionRule => conditionFactory(conditionRule, game))
  }

  assertIsValid (actionPayload) {
    const unmetConditions = this.conditions.filter(condition => !condition.isMet(actionPayload))
    if (unmetConditions.length) {
      // console.log('==================')
      // console.log('unmetConditions', unmetConditions)
      // console.log('actionPayload', actionPayload)
      throw new Error('conditions not met ^')
    }
  }

  do () {}
}
