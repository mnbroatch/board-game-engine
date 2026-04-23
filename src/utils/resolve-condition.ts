import isPlainObject from "lodash/isPlainObject.js";
import resolveProperties from "./resolve-properties.js";
import { bankOf, type BgioReadonlyState } from "./bgio-resolve-types.js";
import type { ConditionContext, ConditionPayload } from "../types/condition-types.js";
import type { EngineEntity } from "../types/runtime-entity.js";
import {
  expectResolvedEngineEntity,
  expectResolvedEngineEntityOrArray,
  expectResolvedGrid,
} from "./resolve-typed-value.js";
import type { EntityMatcher } from "../types/bagel-types.js";
import type {
  ResolvedConditionHasLine,
  ResolvedConditionInLine,
  ResolvedConditionIs,
  ResolvedConditionIsFull,
  ResolvedConditionContains,
  ResolvedConditionNot,
  ResolvedConditionRule,
  UnresolvedConditionRule,
} from "../types/resolved-condition-types.js";

function isRecord (value: unknown): value is Record<string, unknown> {
  return isPlainObject(value);
}

export function resolveCondition (
  bgioArguments: BgioReadonlyState,
  rule: UnresolvedConditionRule,
  context: ConditionContext,
  payload: ConditionPayload
): ResolvedConditionRule {
  // Shorthand strings: unchanged.
  if (typeof rule === "string") {
    return rule;
  }

  // Shorthand entityType object: unchanged.
  if (rule && typeof rule === "object" && !("conditionType" in rule)) {
    return rule;
  }

  switch (rule.conditionType) {
  case "HasLine": {
    const target = resolveProperties(bgioArguments, rule.target, context, "target");
    expectResolvedGrid(target, "HasLine: resolved target must be a Grid");
    payload.target = target;
    const sequence = resolveProperties(bgioArguments, rule.sequence, context, "sequence") as typeof rule.sequence;
    const resolved = {
      ...rule,
      target,
      // Resolve any non-condition refs inside sequence steps; leave nested `conditions` untouched.
      sequence,
    } satisfies ResolvedConditionHasLine;
    return resolved;
  }
  case "IsFull": {
    const target = resolveProperties(bgioArguments, rule.target, context, "target");
    expectResolvedEngineEntity(target, "IsFull: resolved target must be an EngineEntity");
    payload.target = target;
    const resolved = {
      ...rule,
      target,
    } satisfies ResolvedConditionIsFull;
    return resolved;
  }
  case "InLine": {
    const resolvedTarget = rule.target === undefined
      ? undefined
      : resolveProperties(bgioArguments, rule.target, context, "target");
    expectResolvedEngineEntity(resolvedTarget, "InLine: resolved target must be an EngineEntity");
    const grid = bankOf(bgioArguments).findParent(resolvedTarget);
    expectResolvedGrid(grid, "InLine: target must have Grid parent");
    payload.target = resolvedTarget;
    const sequence = resolveProperties(bgioArguments, rule.sequence, context, "sequence") as typeof rule.sequence;
    const resolved = {
      ...rule,
      target: resolvedTarget,
      grid,
      sequence,
    } satisfies ResolvedConditionInLine;
    return resolved;
  }
  case "Is": {
    const resolvedEntityRaw = rule.entity === undefined
      ? undefined
      : resolveProperties(bgioArguments, rule.entity, context, "entity");
    let resolvedEntity: EngineEntity | undefined;
    if (resolvedEntityRaw !== undefined) {
      expectResolvedEngineEntity(resolvedEntityRaw, "Is: resolved entity must be an EngineEntity");
      resolvedEntity = resolvedEntityRaw;
    }

    const resolvedTargetRaw = rule.target === undefined
      ? undefined
      : resolveProperties(bgioArguments, rule.target, context, "target");
    let resolvedTargetEntity: EngineEntity | EngineEntity[] | undefined;
    if (resolvedTargetRaw !== undefined) {
      expectResolvedEngineEntityOrArray(resolvedTargetRaw, "Is: resolved target must be an EngineEntity (or array)");
      resolvedTargetEntity = resolvedTargetRaw;
      payload.target = resolvedTargetEntity;
    }

    const resolvedMatcherRaw = rule.matcher === undefined
      ? undefined
      : resolveProperties(bgioArguments, rule.matcher, context, "matcher");
    if (resolvedMatcherRaw !== undefined && !isRecord(resolvedMatcherRaw)) {
      throw new Error("Is: matcher must resolve to an object.");
    }
    const resolvedMatcher = resolvedMatcherRaw as EntityMatcher | undefined;

    const resolved = {
      conditionType: "Is",
      ...(resolvedTargetEntity === undefined ? {} : { target: resolvedTargetEntity }),
      ...(resolvedMatcher === undefined ? {} : { matcher: resolvedMatcher }),
      ...(resolvedEntity === undefined ? {} : { entity: resolvedEntity }),
    } satisfies ResolvedConditionIs;
    return resolved;
  }
  case "Contains": {
    const resolvedTargetRaw = rule.target === undefined
      ? undefined
      : resolveProperties(bgioArguments, rule.target, context, "target");
    let resolvedTargetEntity: EngineEntity | EngineEntity[] | undefined;
    if (resolvedTargetRaw !== undefined) {
      expectResolvedEngineEntityOrArray(resolvedTargetRaw, "Contains: resolved target must be an EngineEntity (or array)");
      resolvedTargetEntity = resolvedTargetRaw;
      payload.target = resolvedTargetEntity;
    }
    const resolved = {
      conditionType: "Contains",
      ...(rule.conditions === undefined ? {} : { conditions: rule.conditions }),
      ...(resolvedTargetEntity === undefined ? {} : { target: resolvedTargetEntity }),
    } satisfies ResolvedConditionContains;
    return resolved;
  }
  case "Not": {
    const resolvedTargetRaw = rule.target === undefined
      ? undefined
      : resolveProperties(bgioArguments, rule.target, context, "target");
    let resolvedTargetEntity: EngineEntity | EngineEntity[] | undefined;
    if (resolvedTargetRaw !== undefined) {
      expectResolvedEngineEntityOrArray(resolvedTargetRaw, "Not: resolved target must be an EngineEntity (or array)");
      resolvedTargetEntity = resolvedTargetRaw;
      payload.target = resolvedTargetEntity;
    }
    const resolved = {
      conditionType: "Not",
      conditions: rule.conditions,
      ...(resolvedTargetEntity === undefined ? {} : { target: resolvedTargetEntity }),
    } satisfies ResolvedConditionNot;
    return resolved;
  }
  case "Some":
  case "Every": {
    const resolvedTarget = resolveProperties(bgioArguments, rule.target, context, "target");
    expectResolvedEngineEntityOrArray(resolvedTarget, `${rule.conditionType}: resolved target must be an EngineEntity (or array)`);
    payload.target = resolvedTarget;
    return {
      conditionType: rule.conditionType,
      conditions: rule.conditions,
    };
  }
  case "Or": {
    return {
      conditionType: "Or",
      conditions: rule.conditions,
    };
  }
  case "Evaluate": {
    const resolvedArguments = resolveProperties(bgioArguments, rule.arguments, context, "arguments");
    if (resolvedArguments !== undefined && !isRecord(resolvedArguments)) {
      throw new Error("Evaluate: arguments must resolve to an object.");
    }
    return {
      ...rule,
      arguments: resolvedArguments as typeof rule.arguments,
    };
  }
  default: {
    // For the remaining condition types, generic resolution is sufficient (and will not traverse nested `conditions`).
    const resolved = resolveProperties(bgioArguments, rule, context) as ResolvedConditionRule;
    if (resolved && typeof resolved === "object" && "target" in resolved) {
      const maybeTarget = (resolved as { target?: unknown }).target;
      if (maybeTarget !== undefined) {
        // Best-effort: only set payload if it is actually an engine entity(ies).
        try {
          expectResolvedEngineEntityOrArray(maybeTarget, "Resolved condition target must be EngineEntity or array");
          payload.target = maybeTarget;
        } catch {
          // ignore: payload.target is only a convenience for downstream checks
        }
      }
    }
    return resolved;
  }
  }
}
