import type { BgioReadonlyState } from "./bgio-resolve-types.js";
import resolveProperties from "./resolve-properties.js";
import type { ValueRef } from "../types/bagel-types.js";
import { ValueRefSchema, parseOrThrow } from "../types/schemas/index.js";
import type { ResolutionContext } from "../types/resolution-context.js";

/**
 * Resolve a typed BAGEL ValueRef.
 *
 * Note: the generic `T` captures authoring-time intent; runtime invariants still
 * need explicit assertions in higher-level resolvers (e.g. conditions requiring a Grid).
 */
export default function resolveRef<T> (
  bgioArguments: BgioReadonlyState,
  ref: ValueRef<T>,
  context: ResolutionContext = {}
): T {
  parseOrThrow(ValueRefSchema, ref, "resolveRef: invalid ValueRef");
  return resolveProperties(bgioArguments, ref, context) as T;
}

