import Condition from "./condition.js";
export default class Is extends Condition {
    checkCondition(bgioArguments: unknown, rule: unknown, { target }: Record<string, unknown>, context: Record<string, unknown>): {
        target: unknown;
        conditionIsMet: boolean;
    };
}
//# sourceMappingURL=is-condition.d.ts.map