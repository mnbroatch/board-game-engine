import resolveProperties from "../../utils/resolve-properties.js";

export default class Condition {
  constructor (rule) {
    this.rule = rule
  }
  
  check (bgioArguments, payload, context) {
    const conditionPayload = { ...payload }
    const newContext = { ...context }

    if (conditionPayload.target) {
      newContext.originalTarget = conditionPayload.target
    }

    const rule = resolveProperties(
      bgioArguments,
      this.rule,
      newContext
    )

    // We don't simply defer to payload target because of Parent and RelativePath
    // target types, for instance, which retarget to another entity
    if (rule.target !== undefined) {
      conditionPayload.target = rule.target
    }

    // Nonexistent entities never fulfill conditions (including "Not" conditions!)
    if (this.rule.target !== undefined && !conditionPayload.target) {
      return { conditionIsMet: false }
    }
    
    return this.checkCondition(bgioArguments, rule, conditionPayload, newContext)
  }

  isMet(...args) {
    return this.check(...args).conditionIsMet
  }
}
