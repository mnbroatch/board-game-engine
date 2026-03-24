import Condition from "./condition.js";
export default class SomeCondition extends Condition {
    checkCondition(bgioArguments: unknown, rule: unknown, conditionPayload: Record<string, unknown>, context: Record<string, unknown>): {
        conditionIsMet: boolean;
        result: unknown;
    };
}
//# sourceMappingURL=some-condition.d.ts.map