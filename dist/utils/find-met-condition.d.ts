import type { Condition as ConditionRule } from "../types/bagel-types.js";
export default function findMetCondition(bgioArguments: unknown, conditions: ConditionRule[] | undefined, payload: Record<string, unknown>, context: Record<string, unknown>): {
    [k: string]: unknown;
    conditionRule: unknown;
} | undefined;
//# sourceMappingURL=find-met-condition.d.ts.map