import conditionFactory from "../game-factory/condition/condition-factory.js";
import type { Condition } from "../types/expanded-game-types.js";
import type { BgioReadonlyState, BgioResolveState } from "./bgio-resolve-types.js";
import type { ConditionContext, ConditionPayload } from "../types/condition-types.js";
import { assertHasConditionIsMet, assertRecord } from "./type-asserts.js";

export default function findMetCondition (
  bgioArguments: BgioReadonlyState | BgioResolveState,
  conditions: Condition[] = [],
  payload: ConditionPayload,
  context: ConditionContext,
) {
  let success: { conditionRule: unknown; [k: string]: unknown } | undefined;
  for (const conditionRule of conditions) {
    const result = conditionFactory(conditionRule)!
      .check(bgioArguments, payload, context);
    assertHasConditionIsMet(result, "Condition result must include boolean conditionIsMet");
    if (result.conditionIsMet) {
      assertRecord(result, "Condition result must be a record");
      success = {
        ...result,
        conditionRule,
      };
      break;
    }
  }
  return success;
}
