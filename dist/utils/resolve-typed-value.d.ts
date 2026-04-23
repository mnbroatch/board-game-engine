import type { BgioReadonlyState } from "./bgio-resolve-types.js";
import Grid from "../game-factory/space-group/grid.js";
import type { EngineEntity, EngineEntityContainer } from "../types/runtime-entity.js";
import type { ResolutionContext } from "../types/resolution-context.js";
export declare function expectResolvedEngineEntity(value: unknown, message: string): asserts value is EngineEntity;
export declare function expectResolvedEngineEntityArray(value: unknown, message: string): asserts value is EngineEntity[];
export declare function expectResolvedEngineEntityOrArray(value: unknown, message: string): asserts value is EngineEntity | EngineEntity[];
export declare function expectResolvedGrid(value: unknown, message: string): asserts value is Grid;
export declare function expectResolvedEngineEntityContainer(value: unknown, message: string): asserts value is EngineEntityContainer;
/**
 * Resolve a subtree as an entity (uses the same `target` key semantics as {@link resolveProperties}).
 */
export declare function resolveFieldAsEngineEntity(bgioArguments: BgioReadonlyState, node: unknown, context: ResolutionContext, message: string): EngineEntity;
/**
 * Resolve a subtree as a {@link Grid} (entity-revival via `target`, then instanceof check).
 */
export declare function resolveFieldAsGrid(bgioArguments: BgioReadonlyState, node: unknown, context: ResolutionContext, message: string): Grid;
//# sourceMappingURL=resolve-typed-value.d.ts.map