import isPlainObject from "lodash/isPlainObject.js";
import { bankOf, type BgioResolveState } from "./bgio-resolve-types.js";

const abstractTargetNames = ["state"];

export default function resolveEntity (
  bgioArguments: BgioResolveState,
  target: unknown,
  context: unknown,
  targetName: string | undefined
): unknown {
  return !abstractTargetNames.includes(targetName ?? "") && isPlainObject(target)
    ? bankOf(bgioArguments).find(bgioArguments, target, context)
    : target;
}
