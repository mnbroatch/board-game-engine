import Condition from "./condition.js";
import entityMatches from '../../utils/entity-matches.js'
import type { BgioReadonlyState, BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ConditionContext, ConditionPayload } from "../../types/condition-types.js";
import type { ResolvedConditionIs, ResolvedConditionRule } from "../../types/resolved-condition-types.js";
import type { MoveArgumentsState } from "../../types/resolution-context.js";
import { expectResolvedEngineEntity } from "../../utils/resolve-typed-value.js";

export default class Is extends Condition {
  checkCondition (bgioArguments: BgioReadonlyState | BgioResolveState, rule: ResolvedConditionRule, { target }: ConditionPayload, context: ConditionContext) {
    const r = rule as ResolvedConditionIs;
    const resolvedTarget = (r.target ?? target) as ConditionPayload["target"];
    if ((this.rule as { entity?: unknown }).entity && resolvedTarget !== r.entity) {
      return {
        target: resolvedTarget,
        conditionIsMet: false,
      }
    }

    expectResolvedEngineEntity(resolvedTarget, "Is condition: target must resolve to an EngineEntity");
    return {
      target: resolvedTarget,
      conditionIsMet: entityMatches(
        bgioArguments,
        (r.matcher ?? {}) as MoveArgumentsState,
        resolvedTarget,
        context
      )
    }
  }
}
