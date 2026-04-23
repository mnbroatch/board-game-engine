import pick from "lodash/pick.js";
import conditionFactory from "./condition-factory.js";
import Condition from "./condition.js";
import type { BgioReadonlyState, BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ConditionContext, ConditionPayload } from "../../types/condition-types.js";
import type { EngineEntity, EngineEntityContainer } from "../../types/runtime-entity.js";
import type { ResolvedConditionContainsSame, ResolvedConditionRule } from "../../types/resolved-condition-types.js";
import { assertRecord } from "../../utils/type-asserts.js";

export default class ContainsSame extends Condition {
  checkCondition (bgioArguments: BgioReadonlyState | BgioResolveState, rule: ResolvedConditionRule, conditionPayload: ConditionPayload, _newContext: ConditionContext) {
    const targets = (conditionPayload.targets ?? []).filter(Boolean) as EngineEntity[];
    const containers = targets.map((t) => {
      if ("entities" in t || "spaces" in t) return t as EngineEntityContainer;
      throw new Error("ContainsSame: each target must be an EngineEntityContainer");
    });

    const getCandidates = (c: EngineEntityContainer) =>
      ("entities" in c ? c.entities : undefined) ??
      ("spaces" in c ? c.spaces : undefined) ??
      [];

    if (containers.length === 1 && getCandidates(containers[0]).length) {
      return { conditionIsMet: true }
    }

    const [ first, ...restContainers ] = containers;
    const conditionIsMet = getCandidates(first).some((entity: EngineEntity) => {
      const e = entity as { rule?: unknown };
      assertRecord(e.rule, "ContainsSame: entity.rule must be a record");
      const condition = conditionFactory({
        conditionType: "Contains",
        conditions: [{
          conditionType: 'Is',
          matcher: pick(e.rule, (rule as ResolvedConditionContainsSame).properties as never)
        }]
      });
      if (!condition) return false;
      return restContainers.every((ent) => {
        return condition.isMet(bgioArguments, { target: ent })
      })
    })

    return { conditionIsMet }
  }
}
