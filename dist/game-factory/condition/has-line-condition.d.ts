import Condition from "./condition.js";
export default class HasLineCondition extends Condition {
    checkCondition(bgioArguments: unknown, rule: unknown, payload: Record<string, unknown>, context: Record<string, unknown>): {
        matches: unknown[];
        conditionIsMet: boolean;
    };
}
//# sourceMappingURL=has-line-condition.d.ts.map