import type { Condition as ConditionRule } from "../../types/expanded-game-types.js";
import Condition from "../condition/condition.js";
import checkConditions from "../../utils/check-conditions.js";
import type { BgioReadonlyState, BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ConditionContext, ConditionPayload } from "../../types/condition-types.js";
import type { EngineEntity } from "../../types/runtime-entity.js";
import type { EngineEntityContainer } from "../../types/runtime-entity.js";
import type { ResolvedConditionContains, ResolvedConditionRule } from "../../types/resolved-condition-types.js";

export default class ContainsCondition extends Condition {
  checkCondition (bgioArguments: BgioReadonlyState | BgioResolveState, rule: ResolvedConditionRule, payload: ConditionPayload, context: ConditionContext) {
    const container = payload.target as EngineEntityContainer | undefined;

    if (!container) {
      return { matches: [], conditionIsMet: false }
    } else {
      const candidates =
        ("entities" in container ? container.entities : undefined) ??
        ("spaces" in container ? container.spaces : undefined);
      const matches = candidates?.filter((entity: EngineEntity) => checkConditions(
        bgioArguments,
        (rule as ResolvedConditionContains as { conditions?: ConditionRule[] }).conditions,
        { target: entity },
        context
      ).conditionsAreMet) ?? []
      return { matches, conditionIsMet: !!matches.length }
    }
  }
}
