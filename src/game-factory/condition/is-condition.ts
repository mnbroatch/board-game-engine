import Condition from "./condition.js";
import entityMatches from '../../utils/entity-matches.js'
import type { BgioResolveState } from "../../utils/bgio-resolve-types.js";

export default class Is extends Condition {
  checkCondition (bgioArguments: unknown, rule: unknown, { target }: Record<string, unknown>, context: Record<string, unknown>) {
    if ((this.rule as { entity?: unknown }).entity && target !== (rule as { entity?: unknown }).entity) {
      return {
        target,
        conditionIsMet: false,
      }
    }

    return {
      target,
      conditionIsMet: entityMatches(
        bgioArguments as BgioResolveState,
        (rule as { matcher: Record<string, unknown> }).matcher,
        target as { rule: Record<string, unknown>; state?: Record<string, unknown> },
        context
      )
    }
  }
}
