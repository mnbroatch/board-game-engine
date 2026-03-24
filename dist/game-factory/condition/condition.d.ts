export default abstract class Condition {
    rule: unknown;
    constructor(rule: unknown);
    check(bgioArguments: unknown, payload: Record<string, unknown>, context: Record<string, unknown>): {
        conditionIsMet: boolean;
    };
    abstract checkCondition(bgioArguments: unknown, rule: unknown, conditionPayload: Record<string, unknown>, newContext: Record<string, unknown>): {
        conditionIsMet: boolean;
        [k: string]: unknown;
    };
    isMet(...args: unknown[]): boolean;
}
//# sourceMappingURL=condition.d.ts.map