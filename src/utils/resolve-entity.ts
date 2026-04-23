import isPlainObject from "lodash/isPlainObject.js";
import type { RuleWithConditions } from "../types/rule-with-conditions.js";
import { bankOf, type BgioReadonlyState } from "./bgio-resolve-types.js";
import type { ResolutionContext } from "../types/resolution-context.js";

const abstractTargetNames = ["state"];

function isRuntimeSelector (val: unknown): val is RuleWithConditions & { matchMultiple?: boolean } {
  if (!isPlainObject(val)) return false;
  return "conditions" in (val as object);
}

export default function resolveEntity (
  bgioArguments: BgioReadonlyState,
  target: unknown,
  context: ResolutionContext,
  targetName: string | undefined
): unknown {
  return !abstractTargetNames.includes(targetName ?? "") && isRuntimeSelector(target)
    ? bankOf(bgioArguments).find(
      bgioArguments,
      target,
      context
    )
    : target;
}
