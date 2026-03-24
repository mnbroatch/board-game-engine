import Condition from "./condition.js";
export default class NotCondition extends Condition {
    checkCondition(bgioArguments: unknown, rule: unknown, payload: Record<string, unknown>, context: Record<string, unknown>): {
        conditionIsMet: boolean;
    };
}
//# sourceMappingURL=not-condition.d.ts.map