import Condition from "../condition/condition.js";
export default class Evaluate extends Condition {
    checkCondition(bgioArguments: unknown, rule: unknown, payload: Record<string, unknown>, context: Record<string, unknown>): {
        result: unknown;
        conditionIsMet: boolean;
    };
}
//# sourceMappingURL=evaluate-condition.d.ts.map