import { Parser } from "expr-eval";
import type { BgioReadonlyState } from "./bgio-resolve-types.js";
import type { MoveArgumentsState, ResolutionContext } from "../types/resolution-context.js";

const parser = new Parser();
(parser.functions as Record<string, (...args: unknown[]) => unknown>).sum = (...args: unknown[]) =>
  (args[0] as number[]).reduce((acc, val) => acc + val, 0);

export default function resolveExpression (
  bgioArguments: BgioReadonlyState,
  rule: { expression: string; arguments?: MoveArgumentsState },
  context: ResolutionContext
): unknown {
  void bgioArguments;
  void context;
  return parser.evaluate(rule.expression, rule.arguments ?? {});
}
