import Condition from '../condition/condition'

export default class SomeCondition extends Condition {
  isMet () {
    return this.rules.conditions.some(c => new Condition(c).isMet())
  }
}
