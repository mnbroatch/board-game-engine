import type { Condition as ConditionRule } from "../types/bagel-types.js";
export default function checkConditions(bgioArguments: unknown, conditions?: ConditionRule[], payload?: Record<string, unknown>, context?: Record<string, unknown>): {
    results: unknown[];
    failedAt: unknown;
    conditionsAreMet: boolean;
};
//# sourceMappingURL=check-conditions.d.ts.map