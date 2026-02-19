export default class Entity {
  constructor (options, rule, id) {
    if (!options?.fromBank) {
      throw new Error(`Do not create entities directly. Go through the Bank. rule: ${JSON.stringify(rule)}`)
    }
    this.rule = rule
    this.entityId = id
    this.state = {}
    if (this.rule.stateGroups) {
      Object.entries(this.rule.stateGroups)
        .forEach(([stateGroupName, stateGroupValues]) => {
          const stateGroupValueName = options?.initialStateGroups?.[stateGroupName]
            ?? Object.keys(stateGroupValues)[0]
          Object.assign(this.state, stateGroupValues[stateGroupValueName])
        })
    }
    if (this.rule.state) {
      Object.assign(this.state, this.rule.state)
    }
  }

  get attributes () {
    return {
      ...this.rule,
      ...this,
      ...this.state
    }
  }
}
