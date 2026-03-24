import pick from "lodash/pick.js";
import conditionFactory from "./condition-factory.js";
import Condition from "./condition.js";

export default class ContainsSame extends Condition {
  checkCondition (bgioArguments: unknown, rule: unknown, conditionPayload: Record<string, unknown>, _newContext: Record<string, unknown>) {
    const { targets } = conditionPayload as { targets: { entities?: unknown[]; rule?: unknown }[] };
    if (targets.length === 1 && targets[0].entities?.length) {
      return { conditionIsMet: true }
    }

    const [ first, ...restEntities ] = targets;
    const conditionIsMet = (first.entities ?? []).some((entity: unknown) => {
      const e = entity as { rule?: unknown };
      const condition = conditionFactory({
        conditionType: "Contains",
        conditions: [{
          conditionType: 'Is',
          matcher: pick(e.rule as object, (rule as { properties: unknown }).properties as never)
        }]
      });
      if (!condition) return false;
      return restEntities.every((ent: unknown) => {
        return condition.isMet(bgioArguments, { target: ent })
      })
    })

    return { conditionIsMet }
  }
}
