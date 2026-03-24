import Condition from "../condition/condition.js";
export default class ContainsCondition extends Condition {
    checkCondition(bgioArguments: unknown, rule: unknown, payload: Record<string, unknown>, context: Record<string, unknown>): {
        matches: unknown[];
        conditionIsMet: boolean;
    };
}
//# sourceMappingURL=contains-condition.d.ts.map