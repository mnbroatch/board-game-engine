import Condition from "./condition.js";
import gridContainsSequence from "../../utils/grid-contains-sequence.js";
import type { GridLike, SequenceChunk } from "../../utils/grid-contains-sequence.js";

export default class HasLineCondition extends Condition {
  checkCondition (bgioArguments: unknown, rule: unknown, payload: Record<string, unknown>, context: Record<string, unknown>) {
    const { matches } = gridContainsSequence(
      bgioArguments,
      payload.target as GridLike,
      (rule as { sequence: SequenceChunk[] }).sequence,
      context
    ) as { matches: unknown[] };
    return { matches, conditionIsMet: !!matches.length };
  }
}
