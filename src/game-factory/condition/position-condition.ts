import Condition from "./condition.js";
import { bankOf, type BgioReadonlyState, type BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ConditionContext, ConditionPayload } from "../../types/condition-types.js";
import type { EngineEntity } from "../../types/runtime-entity.js";
import type { ResolvedConditionPosition, ResolvedConditionRule } from "../../types/resolved-condition-types.js";
import { expectResolvedEngineEntity, expectResolvedEngineEntityContainer } from "../../utils/resolve-typed-value.js";

export default class Position extends Condition {
  checkCondition (bgioArguments: BgioReadonlyState | BgioResolveState, rule: ResolvedConditionRule, conditionPayload: ConditionPayload, _newContext: ConditionContext) {
    const raw = conditionPayload.target;
    const maybeTarget = Array.isArray(raw) ? raw[0] : raw;
    if (!maybeTarget) return { conditionIsMet: false };
    expectResolvedEngineEntity(maybeTarget, "Position: target must resolve to an EngineEntity");
    const target: EngineEntity = maybeTarget;

    const parent = bankOf(bgioArguments).findParent(target);
    expectResolvedEngineEntityContainer(parent, "Position: target must have a container parent");
    let conditionIsMet = false;
    if ((rule as ResolvedConditionPosition).position === "First") {
      conditionIsMet = ("entities" in parent) && parent.entities.indexOf(target) === 0;
    }
    return { conditionIsMet };
  }
}
