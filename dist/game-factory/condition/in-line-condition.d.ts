import Condition from "./condition.js";
export default class InLineCondition extends Condition {
    checkCondition(bgioArguments: unknown, rule: unknown, payload: Record<string, unknown>, context: Record<string, unknown>): {
        matches: unknown[][];
        conditionIsMet: boolean;
    };
}
//# sourceMappingURL=in-line-condition.d.ts.map