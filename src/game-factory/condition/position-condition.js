import Condition from "./condition.js";

export default class Position extends Condition {
  checkCondition(bgioArguments, rule, { target }) {
    const parent = bgioArguments.G.bank.findParent(target)
    let conditionIsMet
    if (rule.position === 'First') {
      conditionIsMet = parent.entities.indexOf(target) === 0
    }
    return { conditionIsMet }
  }
}
