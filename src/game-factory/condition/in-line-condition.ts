import Condition from "./condition.js";
import gridContainsSequence from "../../utils/grid-contains-sequence.js";
import type { GridLike, SequenceChunk } from "../../utils/grid-contains-sequence.js";


export default class InLineCondition extends Condition {
  checkCondition (bgioArguments: unknown, rule: unknown, payload: Record<string, unknown>, context: Record<string, unknown>) {
    const { G } = bgioArguments as { G: { bank: { findParent: (t: unknown) => unknown } } };
    const { target } = payload;
    const parent = G.bank.findParent(payload.target);
    
    const { matches: allMatches } = gridContainsSequence(
      bgioArguments,
      parent as GridLike,
      (rule as { sequence: SequenceChunk[] }).sequence,
      context
    ) as { matches: unknown[][] };
    
    const matches = allMatches.filter((sequence: unknown[]) =>
      sequence.some((space: unknown) => space === target)
    );

    return { matches, conditionIsMet: !!matches.length };
  }
}
