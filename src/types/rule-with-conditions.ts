import type { Condition as AuthoredCondition } from "./bagel-types.js";
import type { Condition } from "./expanded-game-types.js";

/**
 * Rule-shaped object that may carry a `conditions` array.
 *
 * Use {@link AuthoredRuleWithConditions} for pre-expand/authoring shapes,
 * and {@link RuleWithConditions} for post-expand/runtime shapes.
 */
export type AuthoredRuleWithConditions = {
  conditions?: AuthoredCondition | AuthoredCondition[];
} & object;

export type RuleWithConditions = {
  conditions?: Condition | Condition[];
} & object;
