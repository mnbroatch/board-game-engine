import isPlainObject from "lodash/isPlainObject.js";
import resolveEntity from "./resolve-entity.js";
import { notValueRefNode, resolveDiscriminatedValueRef } from "./resolve-value-ref.js";
import type { BgioReadonlyState, BgioResolveState } from "./bgio-resolve-types.js";
import type { ResolutionContext } from "../types/resolution-context.js";

export type { BgioReadonlyState, BgioResolveState };

const resolutionTerminators = [
  "conditions",
  "move",
  "then",
  "mapping",
];

export default function resolveProperties (
  bgioArguments: BgioReadonlyState,
  obj: unknown,
  context: ResolutionContext = {},
  key?: string
): unknown {
  if (!isPlainObject(obj) && !Array.isArray(obj)) {
    return obj;
  }

  let resolvedProperties: Record<string, unknown> | unknown[] = Array.isArray(obj)
    ? [...obj]
    : { ...(obj as Record<string, unknown>) };

  Object.entries(obj as Record<string, unknown>).forEach(([k, value]) => {
    if (!resolutionTerminators.includes(k)) {
      (resolvedProperties as Record<string, unknown>)[k] = resolveProperties(bgioArguments, value, context, k);
    }
  });

  const resolved = resolveProperty(bgioArguments, resolvedProperties, context);

  const resolveAsEntity = (resolved as { resolveAsEntity?: boolean } | null)?.resolveAsEntity
    || key === "target"
    || key === "targets";

  return resolveAsEntity
    ? resolveEntity(
        bgioArguments,
        resolved,
        context,
        key
      )
    : resolved;
}

function resolveProperty (
  bgioArguments: BgioReadonlyState,
  value: unknown,
  context: ResolutionContext
): unknown {
  const refResult = resolveDiscriminatedValueRef(
    bgioArguments,
    value,
    context,
    resolveProperties
  );
  if (refResult !== notValueRefNode) {
    return refResult;
  }
  return value;
}
