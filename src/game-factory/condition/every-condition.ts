import type { Condition as ConditionRule } from "../../types/expanded-game-types.js";
import Condition from "./condition.js";
import checkConditions from "../../utils/check-conditions.js";
import type { BgioReadonlyState, BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ConditionContext, ConditionPayload } from "../../types/condition-types.js";
import type { EngineEntity } from "../../types/runtime-entity.js";
import type { ResolvedConditionRule } from "../../types/resolved-condition-types.js";

export default class EveryCondition extends Condition {
  checkCondition (bgioArguments: BgioReadonlyState | BgioResolveState, rule: ResolvedConditionRule, conditionPayload: ConditionPayload, context: ConditionContext) {
    const raw = conditionPayload.target;
    if (raw === undefined) {
      return { conditionIsMet: false, results: [] };
    }
    const targets = Array.isArray(raw) ? raw : [raw];
    const results = targets.map((target: EngineEntity) => {
      const loopContext = {
        ...context,
        loopTarget: target
      }

      return checkConditions(
        bgioArguments,
        (rule as { conditions?: ConditionRule[] }).conditions,
        { target },
        loopContext
      )
    })

    return {
      conditionIsMet: results.every((r: { conditionsAreMet: boolean }) => r.conditionsAreMet),
      results
    }
  }
}
