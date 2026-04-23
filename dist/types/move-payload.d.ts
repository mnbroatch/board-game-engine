import type { EngineEntity } from "./runtime-entity.js";
import type { MoveArgumentsMap } from "./move-arguments.js";
import type { MoveDefinition } from "./expanded-game-types.js";
import type { JsonValue } from "./json.js";
export type MoveType = MoveDefinition["moveType"];
/**
 * Argument object shapes keyed by `moveType`.
 *
 * Note: value types differ by layer (client vs prepared vs runtime). This mapping only
 * fixes the *argument names* per move type.
 */
export type MoveArgsByType<TArg> = {
    PlaceNew: {
        destination: TArg;
    };
    MoveEntity: {
        entity: TArg;
        destination: TArg;
    };
    RemoveEntity: {
        entity: TArg;
    };
    TakeFrom: {
        source: TArg;
        destination: TArg;
    };
    SetState: {
        entity: TArg;
        state: TArg;
    };
    ForEach: {
        targets: TArg;
    };
    Shuffle: {
        target: TArg;
    };
    SetActivePlayers: {};
    EndTurn: {};
    PassTurn: {};
    Pass: {};
};
type PartialArgsByType<M extends MoveType, TArg> = M extends MoveType ? Partial<MoveArgsByType<TArg>[M]> : never;
/**
 * Engine move payload arguments after {@link Move.doMove} merges client payload with the resolved rule
 * (entities revived from the bank where applicable).
 */
export type MovePayload<TArguments extends MoveArgumentsMap = MoveArgumentsMap> = {
    arguments?: Partial<TArguments>;
};
/** Runtime destination that accepts newly placed entities. */
export type PlaceNewDestination = {
    placeEntity(entity: EngineEntity, position?: unknown): void;
};
/** Runtime destination for {@link MoveMoveEntity} (may receive any condition target as the piece). */
export type MoveEntityDestination = {
    placeEntity(entity: EngineEntity, position?: unknown): void;
};
/** Runtime source for {@link MoveTakeFrom} — e.g. a bag or draw pile. */
export type TakeFromSource = {
    takeOne(position: unknown): unknown;
};
/** Runtime destination that accepts a single entity from take-from / similar. */
export type TakeFromDestination = {
    placeEntity(entity: unknown): void;
};
export type PlaceNewDoPayload = MovePayload & {
    arguments: {
        destination: PlaceNewDestination;
    };
};
export type MoveEntityDoPayload = MovePayload & {
    arguments: {
        entity: EngineEntity | EngineEntity[];
        destination: MoveEntityDestination;
    };
};
/** Entity returned to the bank (runtime). */
export type RemoveEntityDoPayload = MovePayload & {
    arguments: {
        entity: EngineEntity;
    };
};
export type TakeFromDoPayload = MovePayload & {
    arguments: {
        source: TakeFromSource;
        destination: TakeFromDestination;
    };
};
export type SetStateDoPayload = MovePayload & {
    arguments: {
        entity: EngineEntity;
        state: {
            property: string;
            value: JsonValue;
        };
    };
};
export type ForEachDoPayload = MovePayload & {
    arguments: {
        targets: EngineEntity[];
    };
};
export type ShuffleDoPayload = MovePayload & {
    arguments: {
        target: {
            entities: EngineEntity[];
        };
    };
};
/** Client/UI abstract pick (not resolved through bank lookup). */
export type AbstractPickArgument = {
    abstract?: boolean;
    entityId?: unknown;
    value?: unknown;
};
/**
 * Client/UI argument slot before {@link preparePayload}: may be an abstract pick, entity id, or concrete value.
 */
export type ClientArgument = AbstractPickArgument | unknown;
/**
 * Client-side payload before stripping abstract targets to ids for serialization.
 */
export type ClientMovePayload<M extends MoveType = MoveType> = {
    arguments?: PartialArgsByType<M, ClientArgument>;
};
/**
 * Prepared/transport argument slot produced by {@link preparePayload}.
 * Non-abstract entity picks are converted to ids.
 */
export type PreparedMoveArgument = number | AbstractPickArgument;
/** Prepared/transport argument object keyed by `moveType` (when known). */
export type PreparedMoveArgumentsByType<M extends MoveType = MoveType> = PartialArgsByType<M, PreparedMoveArgument>;
/**
 * Prepared/transport payload shape sent over boardgame.io / wackson.
 *
 * This remains an open map because runtime callers (e.g. Would-condition simulation)
 * may synthesize argument names dynamically.
 */
export type PreparedMoveArgumentsMap = {
    [argumentName: string]: PreparedMoveArgument | undefined;
};
export type PreparedMovePayload<TArguments extends PreparedMoveArgumentsMap = PreparedMoveArgumentsMap> = {
    arguments?: Partial<TArguments>;
};
/** Simulated engine argument after ids are hydrated via `bank.locate`. */
export type SimulatedMoveArgument = EngineEntity | AbstractPickArgument;
/** Simulated payload passed to `Move#doMove` during optimistic evaluation. */
export type SimulatedMoveArgumentsByType<M extends MoveType = MoveType> = PartialArgsByType<M, SimulatedMoveArgument>;
/** Internal simulation needs dynamic argument keys. */
export type SimulatedMoveArgumentsMap = {
    [argumentName: string]: SimulatedMoveArgument | undefined;
};
export type SimulatedMovePayload = {
    arguments: SimulatedMoveArgumentsMap;
};
export {};
//# sourceMappingURL=move-payload.d.ts.map