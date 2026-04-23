import type { TargetSelector, ValueRef } from "./bagel-types.js";
import type { EngineEntity, EngineEntityContainer } from "./runtime-entity.js";

/** Ref or selector that should resolve to an {@link EngineEntity}. */
export type EntityValueRef = ValueRef<EngineEntity> | TargetSelector;

/** Ref or selector that should resolve to a container entity (`.entities` or `.spaces`). */
export type ContainerValueRef = ValueRef<EngineEntityContainer> | TargetSelector;

export type {
  EntityLineTargetRef as AuthoredEntityLineTargetRef,
  GridValueRef as AuthoredGridValueRef,
} from "./bagel-types.js";
