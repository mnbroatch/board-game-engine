import type { Condition } from "./bagel-types.js";
/**
 * Rule-shaped object that may carry a `conditions` array (moves, move arguments,
 * entity/slot rules, scenarios, composite conditions).
 */
export type RuleWithConditions = {
    conditions?: Condition[];
} & Record<string, unknown>;
//# sourceMappingURL=rule-with-conditions.d.ts.map