import resolveProperties from "../../utils/resolve-properties.js";
import type { BgioResolveState } from "../../utils/bgio-resolve-types.js";

export default abstract class Condition {
  rule: unknown;

  constructor (rule: unknown) {
    this.rule = rule;
  }

  check (bgioArguments: unknown, payload: Record<string, unknown>, context: Record<string, unknown>) {
    const conditionPayload = { ...payload };
    const newContext = { ...context };

    if (conditionPayload.target) {
      newContext.originalTarget = conditionPayload.target;
    }

    const rule = resolveProperties(
      bgioArguments as BgioResolveState,
      this.rule,
      newContext
    );

    if ((rule as { target?: unknown }).target !== undefined) {
      conditionPayload.target = (rule as { target: unknown }).target;
    }

    if ((this.rule as { target?: unknown }).target !== undefined && !conditionPayload.target) {
      return { conditionIsMet: false };
    }

    return this.checkCondition(bgioArguments, rule, conditionPayload, newContext);
  }

  abstract checkCondition (
    bgioArguments: unknown,
    rule: unknown,
    conditionPayload: Record<string, unknown>,
    newContext: Record<string, unknown>
  ): { conditionIsMet: boolean; [k: string]: unknown };

  isMet (...args: unknown[]) {
    return (this.check as (a: unknown, b: Record<string, unknown>, c: Record<string, unknown>) => { conditionIsMet: boolean })(
      args[0],
      (args[1] as Record<string, unknown>) ?? {},
      (args[2] as Record<string, unknown>) ?? {}
    ).conditionIsMet;
  }
}
