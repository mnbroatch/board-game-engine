import { Parser } from "expr-eval";
import resolveProperties from "./resolve-properties.js";
import type { BgioResolveState } from "./bgio-resolve-types.js";

const parser = new Parser();
(parser.functions as Record<string, (...args: unknown[]) => unknown>).sum = (...args: unknown[]) =>
  (args[0] as number[]).reduce((acc, val) => acc + val, 0);

export default function resolveExpression (
  bgioArguments: BgioResolveState,
  rule: { expression: string; arguments?: unknown },
  context: Record<string, unknown>
): unknown {
  const args = resolveProperties(bgioArguments, rule.arguments, context) as Record<string, unknown>;
  return parser.evaluate(rule.expression, args);
}
