import Condition from "./condition.js";
import gridContainsSequence from "../../utils/grid-contains-sequence.js";
import type { SequenceChunk } from "../../utils/grid-contains-sequence.js";
import type { BgioReadonlyState, BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ConditionContext, ConditionPayload } from "../../types/condition-types.js";
import type { ResolvedConditionInLine, ResolvedConditionRule } from "../../types/resolved-condition-types.js";


export default class InLineCondition extends Condition {
  checkCondition (bgioArguments: BgioReadonlyState | BgioResolveState, rule: ResolvedConditionRule, _payload: ConditionPayload, context: ConditionContext) {
    const { target, grid } = rule as ResolvedConditionInLine;
    
    const { matches: allMatches } = gridContainsSequence(
      bgioArguments,
      grid,
      (rule as { sequence: SequenceChunk[] }).sequence,
      context
    ) as { matches: unknown[][] };
    
    const matches = allMatches.filter((sequence: unknown[]) =>
      sequence.some((space: unknown) => space === target)
    );

    return { matches, conditionIsMet: !!matches.length };
  }
}
