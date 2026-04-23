import Condition from "./condition.js";
import gridContainsSequence from "../../utils/grid-contains-sequence.js";
import type { SequenceChunk } from "../../utils/grid-contains-sequence.js";
import type { BgioReadonlyState, BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ConditionContext, ConditionPayload } from "../../types/condition-types.js";
import type { ResolvedConditionHasLine, ResolvedConditionRule } from "../../types/resolved-condition-types.js";

export default class HasLineCondition extends Condition {
  checkCondition (bgioArguments: BgioReadonlyState | BgioResolveState, rule: ResolvedConditionRule, _payload: ConditionPayload, context: ConditionContext) {
    const gridTarget = (rule as ResolvedConditionHasLine).target;
    const { matches } = gridContainsSequence(
      bgioArguments,
      gridTarget,
      (rule as { sequence: SequenceChunk[] }).sequence,
      context
    ) as { matches: unknown[] };
    return { matches, conditionIsMet: !!matches.length };
  }
}
