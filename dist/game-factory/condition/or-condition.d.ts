import Condition from "./condition.js";
export default class Or extends Condition {
    checkCondition(bgioArguments: unknown, rule: unknown, payload: Record<string, unknown>, context: Record<string, unknown>): {
        conditionIsMet: boolean;
    };
}
//# sourceMappingURL=or-condition.d.ts.map