import pick from "lodash/pick.js";
import conditionFactory from "./condition-factory.js";
import Condition from "./condition.js";

export default class ContainsSame extends Condition {
  checkCondition (bgioArguments, rule, { targets }) {
    if (targets.length === 1 && targets[0].entities?.length) {
      return { conditionIsMet: true }
    }

    const [ first, ...restEntities ] = targets;
    const conditionIsMet = first.entities.some(entity => {
      const condition = conditionFactory({
        conditionType: "Contains",
        conditions: [{
          conditionType: 'Is',
          matcher: pick(entity.rule, rule.properties)
        }]
      })
      return restEntities.every(ent => {
        return condition.isMet(bgioArguments, { target: ent })
      })
    })

    return { conditionIsMet }
  }
}
