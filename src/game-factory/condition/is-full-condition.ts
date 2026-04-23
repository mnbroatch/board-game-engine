import Condition from "./condition.js";
import type { BgioReadonlyState, BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ConditionContext, ConditionPayload } from "../../types/condition-types.js";
import type { EngineEntity } from "../../types/runtime-entity.js";
import type { ResolvedConditionIsFull, ResolvedConditionRule } from "../../types/resolved-condition-types.js";

export default class IsFull extends Condition {
  checkCondition (_bgioArguments: BgioReadonlyState | BgioResolveState, rule: ResolvedConditionRule, _payload: ConditionPayload, _context: ConditionContext) {
    const t = (rule as ResolvedConditionIsFull).target as EngineEntity | undefined;
    const spaces = (t as { spaces?: Array<{ entities?: EngineEntity[] }> } | undefined)?.spaces;
    if (!spaces) {
      return { conditionIsMet: false };
    }
    return {
      conditionIsMet: spaces.every((space) => space?.entities?.length)
    };
  }
}
