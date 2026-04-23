import type { BgioReadonlyState } from "./bgio-resolve-types.js";
import resolveProperties from "./resolve-properties.js";
import Grid from "../game-factory/space-group/grid.js";
import type { EngineEntity, EngineEntityContainer } from "../types/runtime-entity.js";
import type { ResolutionContext } from "../types/resolution-context.js";

export function expectResolvedEngineEntity (value: unknown, message: string): asserts value is EngineEntity {
  if (!value || typeof value !== "object" || (value as { entityId?: unknown }).entityId === undefined) {
    throw new Error(message);
  }
}

export function expectResolvedEngineEntityArray (value: unknown, message: string): asserts value is EngineEntity[] {
  if (!Array.isArray(value)) {
    throw new Error(message);
  }
  value.forEach((v) => expectResolvedEngineEntity(v, message));
}

export function expectResolvedEngineEntityOrArray (
  value: unknown,
  message: string
): asserts value is EngineEntity | EngineEntity[] {
  if (Array.isArray(value)) {
    expectResolvedEngineEntityArray(value, message);
  } else {
    expectResolvedEngineEntity(value, message);
  }
}

export function expectResolvedGrid (value: unknown, message: string): asserts value is Grid {
  if (!(value instanceof Grid)) {
    throw new Error(message);
  }
}

export function expectResolvedEngineEntityContainer (value: unknown, message: string): asserts value is EngineEntityContainer {
  if (!value || typeof value !== "object") {
    throw new Error(message);
  }
  const o = value as Record<string, unknown>;
  const hasEntities = "entities" in o && Array.isArray(o.entities);
  const hasSpaces = "spaces" in o && Array.isArray(o.spaces);
  if (!hasEntities && !hasSpaces) {
    throw new Error(message);
  }
}

/**
 * Resolve a subtree as an entity (uses the same `target` key semantics as {@link resolveProperties}).
 */
export function resolveFieldAsEngineEntity (
  bgioArguments: BgioReadonlyState,
  node: unknown,
  context: ResolutionContext,
  message: string
): EngineEntity {
  const v = resolveProperties(bgioArguments, node, context, "target");
  expectResolvedEngineEntity(v, message);
  return v;
}

/**
 * Resolve a subtree as a {@link Grid} (entity-revival via `target`, then instanceof check).
 */
export function resolveFieldAsGrid (
  bgioArguments: BgioReadonlyState,
  node: unknown,
  context: ResolutionContext,
  message: string
): Grid {
  const v = resolveProperties(bgioArguments, node, context, "target");
  expectResolvedGrid(v, message);
  return v;
}
