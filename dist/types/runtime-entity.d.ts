import type { EntityDefinition } from "./entity-definition.js";
export type RuntimeStateGroups = Record<string, Record<string, Record<string, unknown>>>;
export type RuntimeEntityRule = EntityDefinition & {
    index?: number;
    hideLength?: boolean;
    stateGroups?: RuntimeStateGroups;
};
/**
 * Default attribute/state bags for engine-built games. Games can substitute concrete
 * record shapes via {@link EngineEntity}'s type parameters for stronger layering.
 */
export type DefaultEngineEntityAttributes = Record<string, unknown>;
export type DefaultEngineEntityState = Record<string, unknown>;
/**
 * Optional map from entity rule `name` to attribute/state shapes for strongly typed consumers.
 * (Engine internals still use the default {@link EngineEntity} alias.)
 */
export type GameEntityShapeMap = Record<string, {
    attributes: Record<string, unknown>;
    state?: Record<string, unknown>;
}>;
export interface EngineEntityBase<TAttributes extends Record<string, unknown> = DefaultEngineEntityAttributes, TState extends Record<string, unknown> = DefaultEngineEntityState> {
    entityId: number;
    rule: RuntimeEntityRule;
    state?: TState;
    attributes: TAttributes;
}
export interface EngineSpaceEntity<TAttributes extends Record<string, unknown> = DefaultEngineEntityAttributes, TState extends Record<string, unknown> = DefaultEngineEntityState> extends EngineEntityBase<TAttributes, TState> {
    entities: EngineEntity<TAttributes, TState>[];
}
export interface EngineSpaceMethods {
    entities: EngineEntity[];
    isEmpty: () => boolean;
    placeEntity: (entity: EngineEntity, position?: unknown) => void;
    remove: (entity: EngineEntity) => void;
    takeOne?: (position: unknown) => unknown;
}
export interface EngineSpaceGroupEntity<TAttributes extends Record<string, unknown> = DefaultEngineEntityAttributes, TState extends Record<string, unknown> = DefaultEngineEntityState> extends EngineEntityBase<TAttributes, TState> {
    spaces: EngineEntity<TAttributes, TState>[];
}
export type EngineEntity<TAttributes extends Record<string, unknown> = DefaultEngineEntityAttributes, TState extends Record<string, unknown> = DefaultEngineEntityState> = EngineEntityBase<TAttributes, TState> | EngineSpaceEntity<TAttributes, TState> | EngineSpaceGroupEntity<TAttributes, TState>;
/** Entities that can act as containers in conditions (e.g. Contains/ContainsSame). */
export type EngineEntityContainer<TAttributes extends Record<string, unknown> = DefaultEngineEntityAttributes, TState extends Record<string, unknown> = DefaultEngineEntityState> = EngineSpaceEntity<TAttributes, TState> | EngineSpaceGroupEntity<TAttributes, TState>;
//# sourceMappingURL=runtime-entity.d.ts.map