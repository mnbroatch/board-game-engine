import type { BgioReadonlyState, BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ConditionCheckResult, ConditionContext, ConditionPayload } from "../../types/condition-types.js";
import { resolveCondition } from "../../utils/resolve-condition.js";
import type { ResolvedConditionRule } from "../../types/resolved-condition-types.js";
import type { Condition as ConditionRule } from "../../types/expanded-game-types.js";

export default abstract class Condition {
  rule: ConditionRule;

  constructor (rule: ConditionRule) {
    this.rule = rule;
  }

  check (bgioArguments: BgioReadonlyState | BgioResolveState, payload: ConditionPayload, context: ConditionContext) {
    const conditionPayload: ConditionPayload = { ...payload };
    const newContext: ConditionContext = { ...context };

    if (conditionPayload.target) {
      newContext.originalTarget = conditionPayload.target;
    }

    const rule = resolveCondition(bgioArguments, this.rule, newContext, conditionPayload);
    return this.checkCondition(bgioArguments, rule, conditionPayload, newContext);
  }

  abstract checkCondition (
    bgioArguments: BgioReadonlyState | BgioResolveState,
    rule: ResolvedConditionRule,
    conditionPayload: ConditionPayload,
    newContext: ConditionContext
  ): ConditionCheckResult;

  isMet (
    bgioArguments: BgioReadonlyState | BgioResolveState,
    payload: ConditionPayload = {},
    context: ConditionContext = {}
  ) {
    return this.check(bgioArguments, payload, context).conditionIsMet;
  }
}
