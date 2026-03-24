import Condition from "./condition.js";
export default class WouldCondition extends Condition {
    checkCondition(bgioArguments: unknown, rule: unknown, conditionPayload: Record<string, unknown>, context: Record<string, unknown>): {
        results: unknown;
        conditionIsMet: boolean;
    };
}
//# sourceMappingURL=would-condition.d.ts.map