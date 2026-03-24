import isPlainObject from "lodash/isPlainObject.js";
import pick from "lodash/pick.js";
import get from "./get.js";
import resolveExpression from "./resolve-expression.js";
import resolveEntity from "./resolve-entity.js";
import { bankOf, type BgioResolveState } from "./bgio-resolve-types.js";

export type { BgioResolveState };

const resolutionTerminators = [
  "conditions",
  "move",
  "then",
  "mapping",
];

export default function resolveProperties (
  bgioArguments: BgioResolveState,
  obj: unknown,
  context: Record<string, unknown> = {},
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
  bgioArguments: BgioResolveState,
  value: unknown,
  context: Record<string, unknown>
): unknown {
  const v = value as Record<string, unknown> | null;
  if (v?.type === "expression") {
    const expr = v as { expression: string; arguments?: unknown };
    return resolveExpression(
      bgioArguments,
      {
        ...expr,
        arguments: resolveProperties(bgioArguments, expr.arguments, context, "arguments"),
      },
      context
    );
  } else if (v?.type === "count") {
    return bankOf(bgioArguments).findAll(
      bgioArguments,
      value,
      context
    ).length;
  } else if (v?.type === "contextPath") {
    return get(context, v.path as Parameters<typeof get>[1]);
  } else if (v?.type === "ctxPath") {
    return get(bgioArguments.ctx, v.path as Parameters<typeof get>[1]);
  } else if (v?.type === "gamePath") {
    return get(bgioArguments.G, v.path as Parameters<typeof get>[1]);
  } else if (v?.type === "relativePath" || v?.type === "RelativePath") {
    const target = resolveProperties(bgioArguments, v.target, context, "target");
    return get((target as { attributes?: unknown })?.attributes, v.path as Parameters<typeof get>[1]) ?? null;
  } else if (v?.type === "parent" || v?.type === "Parent") {
    const originalTarget = v.target
      ? resolveProperties(bgioArguments, v.target, context, "target")
      : context.originalTarget;
    return bankOf(bgioArguments).findParent(originalTarget) ?? null;
  } else if (v?.type === "map") {
    return getMappedTargets(
      bgioArguments,
      v.targets,
      v.mapping,
      context
    ).map((mappedTarget) => mappedTarget.value);
  } else if (v?.type === "mapMax") {
    const mappedTargets = getMappedTargets(
      bgioArguments,
      v.targets,
      v.mapping,
      context
    );
    let maxValue: number | undefined;
    const maxTargets: unknown[] = [];
    for (let i = 0, len = mappedTargets.length; i < len; i++) {
      const { target, value: val } = mappedTargets[i];
      if (maxValue === undefined || (val as number) > maxValue) {
        maxValue = val as number;
        maxTargets.length = 0;
        maxTargets.push(target);
      } else if (val === maxValue) {
        maxTargets.push(target);
      }
    }
    return maxTargets;
  } else if (v?.type === "pick" || v?.type === "Pick") {
    const target = resolveProperties(bgioArguments, v.target, context, "target");
    return pick(
      resolveProperties(
        bgioArguments,
        (target as { attributes?: unknown })?.attributes,
        context,
        "attributes"
      ) as object,
      v.properties as string[]
    );
  } else if (v?.type === "coordinates" || v?.type === "Coordinates") {
    const originalTarget = v.target
      ? resolveProperties(bgioArguments, v.target, context, "target")
      : context.originalTarget;
    const parent = bankOf(bgioArguments).findParent(originalTarget) as { getCoordinates: (i: unknown) => unknown };
    return parent.getCoordinates((originalTarget as { rule: { index: unknown } }).rule.index);
  } else if (v?.type === "relativeCoordinates") {
    const originalTarget = v.target
      ? resolveProperties(bgioArguments, v.target, context, "target")
      : context.originalTarget;
    const parent = bankOf(bgioArguments).findParent(originalTarget) as {
      getCoordinates: (i: unknown) => unknown;
      getRelativeCoordinates: (a: unknown, b: unknown) => unknown;
      spaces: unknown[];
      getIndex: (c: unknown) => number;
    };
    const oldCoordinates =
      parent.getCoordinates((originalTarget as { rule: { index: unknown } }).rule.index);
    const newCoordinates =
      parent.getRelativeCoordinates(
        oldCoordinates,
        resolveProperties(bgioArguments, v.location, context, "location")
      );
    return (newCoordinates && parent.spaces[parent.getIndex(newCoordinates)]) ?? null;
  } else {
    return value;
  }
}

function getMappedTargets (
  bgioArguments: BgioResolveState,
  targetsRule: unknown,
  mapping: unknown,
  context: Record<string, unknown>
): Array<{ target: unknown; value: unknown }> {
  (targetsRule as { resolveAsEntity?: boolean }).resolveAsEntity = true;
  const resolved = resolveProperties(bgioArguments, targetsRule, context) as unknown[] | undefined;
  return resolved?.map((target) => ({
    target,
    value: resolveProperties(
      bgioArguments,
      mapping,
      { ...context, loopTarget: target },
    ),
  })) ?? [];
}
