import isPlainObject from "lodash/isPlainObject.js";
import resolveProperties from "./resolve-properties.js";
import { bankOf, type BgioReadonlyState } from "./bgio-resolve-types.js";
import type { ConditionContext, ConditionPayload } from "../types/condition-types.js";
import type { EngineEntity } from "../types/runtime-entity.js";
import type Grid from "../game-factory/space-group/grid.js";
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
    const sequence = resolveProperties(bgioArguments, rule.sequence, context, "sequence") as typeof rule.sequence;

    const resolvedTargetFromRule = rule.target === undefined
      ? undefined
      : resolveProperties(bgioArguments, rule.target, context, "target");

    // `InLine` is often nested inside other checks; authoring may omit `target` and rely on the
    // ambient `context.target` (the entity currently under evaluation).
    const resolvedTargetRaw = resolvedTargetFromRule
      ?? payload.target
      ?? context.target
      ?? context.originalTarget;

    // Some validation paths evaluate `InLine` before any concrete ambient target exists; treat that
    // as “not applicable” instead of throwing (callers interpret as `conditionIsMet: false`).
    if (resolvedTargetRaw === undefined) {
      // Do not spread `rule` here: authoring may include an unresolved `target` ref, and this branch
      // intentionally returns an incompletely-resolved `InLine` for soft-false evaluation downstream.
      return {
        conditionType: "InLine",
        sequence,
      } satisfies ResolvedConditionInLine;
    }

    expectResolvedEngineEntity(resolvedTargetRaw, "InLine: resolved target must be an EngineEntity");
    const resolvedTarget = resolvedTargetRaw;

    const maybeGrid = resolvedTarget as unknown;
    let gridCandidate: unknown = (maybeGrid as { spaces?: unknown }).spaces
      ? maybeGrid
      : bankOf(bgioArguments).findParent(resolvedTarget);
    expectResolvedGrid(gridCandidate, "InLine: resolved target must be a Grid (or a Space with a Grid parent)");
    const grid = gridCandidate as Grid;
    payload.target = resolvedTarget;
    const resolved = {
      ...rule,
      // Always attach the resolved concrete target for downstream checks, even when authoring omits `target`
      // and we inferred it from ambient `context.target`.
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
    // Some refs (e.g. Parent) may legitimately resolve to `null` when there is no parent.
    // For `Is`, treat that as “unresolved” (omit the resolved target so `Is.checkCondition`
    // falls back to the ambient `target` and returns `false` for non-matching entities).
    let resolvedTargetEntity: EngineEntity | EngineEntity[] | undefined;
    if (resolvedTargetRaw != null) {
      // Covers both EngineEntity and EngineEntity[].
      expectResolvedEngineEntityOrArray(
        resolvedTargetRaw,
        "Is: resolved target must be an EngineEntity (or array)"
      );
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
    if (resolvedTargetRaw != null) {
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
    if (resolvedTargetRaw != null) {
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
    if (resolvedTarget != null) {
      expectResolvedEngineEntityOrArray(resolvedTarget, `${rule.conditionType}: resolved target must be an EngineEntity (or array)`);
      payload.target = resolvedTarget;
    }
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
