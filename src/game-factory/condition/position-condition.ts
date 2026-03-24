import Condition from "./condition.js";

export default class Position extends Condition {
  checkCondition (bgioArguments: unknown, rule: unknown, conditionPayload: Record<string, unknown>, _newContext: Record<string, unknown>) {
    const target = conditionPayload.target;
    const parent = (bgioArguments as { G: { bank: { findParent: (t: unknown) => { entities: unknown[] } } } }).G.bank.findParent(target);
    let conditionIsMet = false;
    if ((rule as { position?: string }).position === "First") {
      conditionIsMet = parent.entities.indexOf(target) === 0;
    }
    return { conditionIsMet };
  }
}
