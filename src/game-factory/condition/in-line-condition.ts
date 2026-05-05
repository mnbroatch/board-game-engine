import Condition from "./condition.js";
import gridContainsSequence from "../../utils/grid-contains-sequence.js";
import type { SequenceChunk } from "../../utils/grid-contains-sequence.js";
import type { BgioReadonlyState, BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ConditionContext, ConditionPayload } from "../../types/condition-types.js";
import type { ResolvedConditionInLine, ResolvedConditionRule } from "../../types/resolved-condition-types.js";


export default class InLineCondition extends Condition {
  checkCondition (bgioArguments: BgioReadonlyState | BgioResolveState, rule: ResolvedConditionRule, _payload: ConditionPayload, context: ConditionContext) {
    const { target, grid } = rule as ResolvedConditionInLine;
    if (grid == null) {
      return { matches: [], conditionIsMet: false };
    }

    const { matches: allMatches } = gridContainsSequence(
      bgioArguments,
      grid,
      (rule as { sequence: SequenceChunk[] }).sequence,
      context
    ) as { matches: unknown[][] };
    
    const matches = allMatches.filter((sequence: unknown[]) =>
      sequence.some((space: unknown) => {
        if (target == null) {
          // If no explicit target was authored, any matching line is a hit (caller controls ambient target).
          return true;
        }
        if (space === target) return true;
        // `target` may be authored as the Grid itself; treat any space in the line as matching.
        if (space && typeof space === "object" && target && typeof target === "object") {
          const s = space as { entityType?: unknown };
          const t = target as { entityType?: unknown; spaces?: unknown };
          if (t.entityType === "Grid" && s.entityType === "Space") return true;
        }
        return false;
      })
    );

    return { matches, conditionIsMet: !!matches.length };
  }
}
