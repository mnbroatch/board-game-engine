import isPlainObject from "lodash/isPlainObject.js";
import pick from "lodash/pick.js";
import get from "./get.js";
import resolveExpression from "./resolve-expression.js";
import type {
  CoordinatesRef,
  ExpressionRef,
  GamePathRef,
  MapMaxRef,
  MapRef,
  ParentRef,
  PickRef,
  RelativeCoordinatesRef,
  RelativePathRef,
} from "../types/bagel-types.js";
import { bankOf, type BgioReadonlyState } from "./bgio-resolve-types.js";
import { isValueRefObject } from "../types/guards/value-ref.js";
import { assertRecord } from "./type-asserts.js";
import type { MoveArgumentsState, ResolutionContext } from "../types/resolution-context.js";

/** Returned when `value` is not a recognized BAGEL {@link ValueRef} node at this step. */
export const notValueRefNode = Symbol("notValueRefNode");

export type ResolvePropertiesFn = (
  bgioArguments: BgioReadonlyState,
  obj: unknown,
  context: ResolutionContext,
  key?: string
) => unknown;

/** Parent of a space on a grid — engine-specific methods used by coordinate refs. */
type GridCoordinateParent = {
  getCoordinates: (index: unknown) => unknown;
};

type GridRelativeParent = GridCoordinateParent & {
  getRelativeCoordinates: (a: unknown, b: unknown) => unknown;
  spaces: unknown[];
  getIndex: (c: unknown) => number;
};

function getMappedTargets (
  bgioArguments: BgioReadonlyState,
  targetsRule: unknown,
  mapping: unknown,
  context: ResolutionContext,
  resolveProperties: ResolvePropertiesFn
): Array<{ target: unknown; value: unknown }> {
  (targetsRule as { resolveAsEntity?: boolean }).resolveAsEntity = true;
  const resolved = resolveProperties(bgioArguments, targetsRule, context);
  if (resolved === undefined) return [];
  if (!Array.isArray(resolved)) {
    assertRecord(resolved, "map/mapMax targets must resolve to an array (or be omitted).");
    throw new Error("map/mapMax targets must resolve to an array.");
  }

  return resolved.map((target) => ({
    target,
    value: resolveProperties(
      bgioArguments,
      mapping,
      { ...context, loopTarget: target },
    ),
  }));
}

/**
 * If `value` is a discriminated BAGEL value-ref object, resolve it and return the result.
 * Otherwise return {@link notValueRefNode} so the caller can fall back to generic resolution.
 */
export function resolveDiscriminatedValueRef (
  bgioArguments: BgioReadonlyState,
  value: unknown,
  context: ResolutionContext,
  resolveProperties: ResolvePropertiesFn
): unknown | typeof notValueRefNode {
  // Keep a fast non-object bailout to avoid work during tree traversal.
  if (!isPlainObject(value)) {
    return notValueRefNode;
  }

  if (!isValueRefObject(value)) {
    return notValueRefNode;
  }

  switch (value.type) {
  case "expression": {
    const expr: ExpressionRef = value;
    const resolvedArguments = resolveProperties(bgioArguments, expr.arguments, context, "arguments");
    if (resolvedArguments !== undefined && (!isPlainObject(resolvedArguments) || Array.isArray(resolvedArguments))) {
      throw new Error("Expression arguments must be an object or undefined.");
    }
    const args: MoveArgumentsState | undefined =
      resolvedArguments === undefined ? undefined : (resolvedArguments as MoveArgumentsState);
    return resolveExpression(
      bgioArguments,
      {
        ...expr,
        arguments: args,
      },
      context
    );
  }
  case "count":
    return bankOf(bgioArguments).findAll(
      bgioArguments,
      value,
      context
    ).length;

  case "contextPath":
    return get(context, value.path as Parameters<typeof get>[1]);

  case "ctxPath":
    return get(bgioArguments.ctx, value.path as Parameters<typeof get>[1]);

  case "gamePath":
    return get(bgioArguments.G, (value as GamePathRef).path as Parameters<typeof get>[1]);

  case "relativePath":
  case "RelativePath": {
    const rp: RelativePathRef = value;
    const target = resolveProperties(bgioArguments, rp.target, context, "target");
    return get((target as { attributes?: unknown })?.attributes, rp.path as Parameters<typeof get>[1]) ?? null;
  }

  case "parent":
  case "Parent": {
    const pr: ParentRef = value;
    const originalTarget = pr.target !== undefined
      ? resolveProperties(bgioArguments, pr.target, context, "target")
      : context.originalTarget;
    return bankOf(bgioArguments).findParent(originalTarget) ?? null;
  }

  case "map": {
    const mr: MapRef = value;
    return getMappedTargets(
      bgioArguments,
      mr.targets,
      mr.mapping,
      context,
      resolveProperties
    ).map((mappedTarget) => mappedTarget.value);
  }

  case "mapMax": {
    const mm: MapMaxRef = value;
    const mappedTargets = getMappedTargets(
      bgioArguments,
      mm.targets,
      mm.mapping,
      context,
      resolveProperties
    );
    let maxValue: number | undefined;
    const maxTargets: unknown[] = [];
    for (let i = 0, len = mappedTargets.length; i < len; i++) {
      const { target, value: val } = mappedTargets[i];
      if (typeof val !== "number") {
        throw new Error("mapMax mapping must resolve to a number.");
      }
      if (maxValue === undefined || val > maxValue) {
        maxValue = val;
        maxTargets.length = 0;
        maxTargets.push(target);
      } else if (val === maxValue) {
        maxTargets.push(target);
      }
    }
    return maxTargets;
  }

  case "pick":
  case "Pick": {
    const pk: PickRef = value;
    const target = resolveProperties(bgioArguments, pk.target, context, "target");
    const attrs = resolveProperties(
      bgioArguments,
      (target as { attributes?: unknown })?.attributes,
      context,
      "attributes"
    );
    if (!attrs || typeof attrs !== "object" || Array.isArray(attrs)) {
      throw new Error("pick target attributes must be an object.");
    }
    return pick(attrs, pk.properties);
  }

  case "coordinates":
  case "Coordinates": {
    const cr: CoordinatesRef = value;
    const originalTarget = cr.target !== undefined
      ? resolveProperties(bgioArguments, cr.target, context, "target")
      : context.originalTarget;
    const parent = bankOf(bgioArguments).findParent(originalTarget) as GridCoordinateParent | undefined;
    if (!parent) return null;
    return parent.getCoordinates((originalTarget as { rule: { index: unknown } }).rule.index);
  }

  case "relativeCoordinates": {
    const rc: RelativeCoordinatesRef = value;
    const originalTarget = rc.target !== undefined
      ? resolveProperties(bgioArguments, rc.target, context, "target")
      : context.originalTarget;
    const parent = bankOf(bgioArguments).findParent(originalTarget) as GridRelativeParent | undefined;
    if (!parent) return null;
    const oldCoordinates =
      parent.getCoordinates((originalTarget as { rule: { index: unknown } }).rule.index);
    const newCoordinates =
      parent.getRelativeCoordinates(
        oldCoordinates,
        resolveProperties(bgioArguments, rc.location, context, "location")
      );
    return (newCoordinates && parent.spaces[parent.getIndex(newCoordinates)]) ?? null;
  }

  default:
    return notValueRefNode;
  }
}
