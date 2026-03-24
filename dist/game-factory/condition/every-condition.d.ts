import Condition from "./condition.js";
export default class EveryCondition extends Condition {
    checkCondition(bgioArguments: unknown, rule: unknown, conditionPayload: Record<string, unknown>, context: Record<string, unknown>): {
        conditionIsMet: boolean;
        results: {
            results: unknown[];
            failedAt: unknown;
            conditionsAreMet: boolean;
        }[];
    };
}
//# sourceMappingURL=every-condition.d.ts.map