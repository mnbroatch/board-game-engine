/**
 * B.A.G.E.L. (Board-based Automated Game Engine Language) types.
 * Subset inferred from the built-in example games.
 *
 * Semantic notes:
 * - EntityAttributes<TRule> = entity rule merged with its default state (runtime view).
 * - displayProperties lists keys of that merged type; UI shows those attribute values.
 * - EntityMatcher is matched against EntityAttributes (lodash-style) at runtime.
 */

import type { EngineEntity } from "./runtime-entity.js";
import type { Condition as ExpandedCondition } from "./expanded-game-types.js";
import type { JsonValue } from "./json.js";

// ---------------------------------------------------------------------------
// Value references (resolved at runtime from context, game state, or expressions)
// ---------------------------------------------------------------------------

export type PathSegment = string | number | { flatten: boolean; map?: string[] };

/**
 * Typed value reference resolved at runtime.
 *
 * `T` is the *expected* runtime result type (authoring-time intent). Some refs
 * (e.g. ctxPath/expression) are inherently polymorphic; callers should pick an
 * appropriate `T` when using them in typed positions.
 */
export type ValueRef<T = unknown> =
  | CtxPathRef<T>
  | ContextPathRef<T>
  | GamePathRef<T>
  | ExpressionRef<T>
  | RelativeCoordinatesRef<T>
  | CoordinatesRef<T>
  | RelativePathRef<T>
  | ParentRef<T>
  | MapRef<T>
  | MapMaxRef<T>
  | PickRef<T>
  | CountRef<T>;

/**
 * Phantom-typed base for BAGEL refs. The `__valueType` field is optional and
 * exists only to carry the generic type parameter through TypeScript.
 */
export interface TypedValueRef<T> {
  __valueType?: T;
}

export interface CtxPathRef<T = unknown> extends TypedValueRef<T> {
  type: "ctxPath";
  path: (string | number)[];
}

export interface ContextPathRef<T = unknown> extends TypedValueRef<T> {
  type: "contextPath";
  path: PathSegment[];
}

export interface GamePathRef<T = unknown> extends TypedValueRef<T> {
  type: "gamePath";
  path: (string | number)[];
}

export interface ExpressionRef<T = unknown> extends TypedValueRef<T> {
  type: "expression";
  expression: string;
  /**
   * Expression argument values may be other refs (resolved at runtime) or raw JSON
   * literals (numbers, strings, arrays, objects) embedded directly in game rules.
   */
  arguments: Record<string, ValueRef<unknown> | JsonValue>;
}

export interface RelativeCoordinatesRef<T = unknown> extends TypedValueRef<T> {
  type: "relativeCoordinates";
  target?: ValueRef<unknown>;
  location: [number, number] | ValueRef<unknown>;
}

export interface CoordinatesRef<T = unknown> extends TypedValueRef<T> {
  type: "coordinates" | "Coordinates";
  target?: ValueRef<unknown>;
}

export interface RelativePathRef<T = unknown> extends TypedValueRef<T> {
  type: "relativePath" | "RelativePath";
  target: ValueRef<unknown> | TargetSelector;
  path: (string | number)[];
}

export interface ParentRef<T = unknown> extends TypedValueRef<T> {
  type: "parent" | "Parent";
  target?: ValueRef<unknown>;
}

export interface MapRef<T = unknown> extends TypedValueRef<T> {
  type: "map";
  targets: ValueRef<unknown> | TargetSelector;
  mapping: ValueRef<unknown> | CountRef<unknown>;
}

export interface MapMaxRef<T = unknown> extends TypedValueRef<T> {
  type: "mapMax";
  targets: ValueRef<unknown>;
  mapping: ValueRef<unknown> | CountRef<unknown>;
}

export interface PickRef<T = unknown> extends TypedValueRef<T> {
  type: "pick" | "Pick";
  target: ValueRef<unknown> | TargetSelector;
  properties: string[];
}

export interface CountRef<T = unknown> extends TypedValueRef<T> {
  type: "count";
  conditions: ExpandedCondition[];
}

// ---------------------------------------------------------------------------
// Conditions (recursive; matched against entity rule merged with state)
// ---------------------------------------------------------------------------

export type Condition =
  | ConditionShorthandString
  | ConditionShorthandEntityType
  | ConditionTyped;

export type ConditionShorthandString = "isEmpty" | "isCurrentPlayer";

export interface ConditionShorthandEntityType {
  entityType: "Space";
}

export type ConditionTyped =
  | ConditionHasLine
  | ConditionIsFull
  | ConditionNoPossibleMoves
  | ConditionPosition
  | ConditionContainsSame
  | ConditionIs
  | ConditionContains
  | ConditionNot
  | ConditionOr
  | ConditionSome
  | ConditionEvery
  | ConditionInLine
  | ConditionEvaluate
  | ConditionWould;

/** Hypothetical move outcome: nested conditions evaluated against simulated state after the move. */
export interface ConditionWould {
  conditionType: "Would";
  conditions?: Condition[];
}

/** Top-level conditions allowed for the readonly overload of `checkConditions`. */
export type ConditionWithoutWould = Exclude<Condition, ConditionWould>;

export interface TargetSelector {
  matchMultiple?: boolean;
  conditions: Condition | Condition[];
}

/**
 * Authoring-time reference for entity-scoped condition `target` fields (`Is`, `Contains`, `Not`):
 * entity `name` (string), a {@link ValueRef}, or a {@link TargetSelector}.
 */
export type EntityLineTargetRef = string | ValueRef<unknown> | TargetSelector;

/**
 * Authoring-time reference to a grid entity: entity `name` (string), a {@link ValueRef}, or a {@link TargetSelector}.
 */
export type GridValueRef = string | ValueRef<unknown> | TargetSelector;

export interface LineSequenceStep {
  minCount?: number;
  conditions: Condition[];
}

/** Authoring shape; after `expandGameRules` see `ConditionHasLine` (post-expand). */
export interface ConditionHasLine {
  conditionType: "HasLine";
  target: GridValueRef;
  sequence: LineSequenceStep[];
}

/** Authoring shape; after `expandGameRules` see `ConditionIsFull` (post-expand). */
export interface ConditionIsFull {
  conditionType: "IsFull";
  target: GridValueRef;
}

export interface ConditionNoPossibleMoves {
  conditionType: "NoPossibleMoves";
}

export interface ConditionPosition {
  conditionType: "Position";
  position: "First";
}

export interface ConditionContainsSame {
  conditionType: "ContainsSame";
  properties: string[];
}

export interface ConditionIs {
  conditionType: "Is";
  target?: EntityLineTargetRef;
  /** Compared against merged rule+state attributes; see {@link EntityMatcher}. */
  matcher?: EntityMatcher;
  entity?: ValueRef<unknown>;
}

export interface ConditionContains {
  conditionType: "Contains";
  target?: EntityLineTargetRef;
  conditions?: Condition[];
}

export interface ConditionNot {
  conditionType: "Not";
  target?: EntityLineTargetRef;
  conditions: Condition[];
}

export interface ConditionOr {
  conditionType: "Or";
  conditions: Condition[];
}

export interface ConditionSome {
  conditionType: "Some";
  target: TargetSelector;
  conditions: Condition[];
}

export interface ConditionEvery {
  conditionType: "Every";
  target: TargetSelector;
  conditions: Condition[];
}

export interface ConditionInLine {
  conditionType: "InLine";
  target?: ValueRef<unknown>;
  sequence: LineSequenceStep[];
}

export interface ConditionEvaluate {
  conditionType: "Evaluate";
  expression: string;
  arguments: Record<string, ValueRef<unknown>>;
}

// ---------------------------------------------------------------------------
// Entities: rule + state merged = runtime attributes
// ---------------------------------------------------------------------------

/** Runtime view: entity rule merged with its default state. Used for display and matching. */
export type EntityAttributes<TRule extends EntityRule> = TRule &
  (TRule extends { state?: infer S } ? (S extends object ? S : object) : object);

/** Keys that can appear on any entity's merged attributes (for matchers over unknown entity type). */
export type EntityAttributeKey =
  | keyof EntityAttributes<EntityGrid>
  | keyof EntityAttributes<EntitySpace>
  | keyof EntityAttributes<EntityGeneric>
  | keyof EntityAttributes<EntityBoard>;

/** Matcher compared against EntityAttributes at runtime. Keys are attribute keys; values may be refs. */
export type EntityMatcher<A extends object = Record<EntityAttributeKey, unknown>> = Partial<
  { [K in keyof A]: A[K] | ValueRef<unknown> }
> & { name?: string };

/** Default state bag on an entity rule; merged into runtime entity state. */
export type EntityState = Record<string, unknown>;

/**
 * Base shape for all entity rules. `variants` is a list of patches merged onto the base rule.
 *
 * The `player` field is used by per-player expansions and matching.
 */
export interface EntityBase<TSelf extends object> {
  name: string;
  perPlayer?: boolean;
  count?: number | "Infinity";
  /** Per-player discriminator used by matchers and per-player entity expansion. */
  player?: string;
  state?: EntityState;
  contentsHiddenFrom?: "All" | "Others";
  /** Expanded into separate entity definitions at setup (see game-factory). */
  variants?: Array<Partial<Omit<TSelf, "variants">>>;
  /** Allow game-specific attributes on entity rules (e.g. cards with `value`/`suit`). */
  [k: string]: unknown;
}

/** Variant patch for a specific entity rule type. */
export type EntityVariantPatch<T extends object> = Partial<Omit<T, "variants">>;

export interface EntityBoard extends EntityBase<EntityBoard> {
  entityType: "Board";
}

export type Entity = EntityGrid | EntitySpace | EntityGeneric | EntityBoard;

export interface EntityGrid extends EntityBase<EntityGrid> {
  entityType: "Grid";
  width: number;
  height: number;
  /** Property names to show in UI; values read from EntityAttributes<EntityGrid>. */
  displayProperties?: (keyof EntityAttributes<EntityGrid>)[];
}

export interface EntitySpace extends EntityBase<EntitySpace> {
  entityType: "Space";
  /** Property names to show in UI; values read from EntityAttributes<EntitySpace>. */
  displayProperties?: (keyof EntityAttributes<EntitySpace>)[];
}

export interface EntityGeneric extends EntityBase<EntityGeneric> {
  entityType?: undefined;
  /** Property names to show in UI; values read from EntityAttributes<EntityGeneric> (rule merged with state). */
  displayProperties?: (keyof EntityAttributes<EntityGeneric>)[];
}

export type EntityRule = EntityGrid | EntitySpace | EntityGeneric | EntityBoard;

// ---------------------------------------------------------------------------
// Moves
// ---------------------------------------------------------------------------

/**
 * One keyed slot under `move.arguments` (or the like): match entities via `conditions`,
 * or expose a player choice with `playerChoice` / `possibleValues` (see {@link getSteps}).
 * Extra keys are allowed for engine / authoring extensions.
 */
export type MoveArgumentBinding<TResolved = unknown> = {
  conditions?: Condition | Condition[];
  playerChoice?: boolean;
  possibleValues?: TResolved[];
  resolveAsEntity?: boolean;
} & Record<string, unknown>;

/** boardgame.io-style fragment passed to `events.setActivePlayers` from bagel rules. */
export type SetActivePlayersOptions = Record<string, {
  stage?: string;
  minMoves?: number;
  maxMoves?: number;
  /** @deprecated Prefer minMoves/maxMoves */
  moveLimit?: number;
} & Record<string, unknown>>;

export type MoveDefinition =
  | MovePlaceNew
  | MoveMoveEntity
  | MoveRemoveEntity
  | MoveTakeFrom
  | MoveSetState
  | MoveSetActivePlayers
  | MoveEndTurn
  | MovePassTurn
  | MoveForEach
  | MoveShuffle
  | MovePass;

export interface MoveCommon {
  /** Set when a move is registered under a key (e.g. from `createMoves`). */
  name?: string;
  conditions?: Condition | Condition[];
  then?: MoveDefinition[];
}

export interface MovePlaceNew extends MoveCommon {
  moveType: "PlaceNew";
  matchMultiple?: boolean;
  entity: MoveArgumentBinding<EngineEntity>;
  arguments: {
    destination: MoveArgumentBinding<EngineEntity>;
  };
}

export interface MoveMoveEntity extends MoveCommon {
  moveType: "MoveEntity";
  position?: "First";
  arguments: {
    entity: MoveArgumentBinding<EngineEntity>;
    destination: MoveArgumentBinding<EngineEntity>;
  };
}

export interface MoveRemoveEntity extends MoveCommon {
  moveType: "RemoveEntity";
  arguments: {
    entity: ValueRef<EngineEntity> | MoveArgumentBinding<EngineEntity>;
  };
}

export interface MoveTakeFrom extends MoveCommon {
  moveType: "TakeFrom";
  arguments: {
    source: MoveArgumentBinding<EngineEntity>;
    destination: MoveArgumentBinding<EngineEntity>;
  };
}

export interface StateUpdate {
  property: string;
  value?: unknown;
  possibleValues?: unknown[];
  playerChoice?: boolean;
}

export interface MoveSetState extends MoveCommon {
  moveType: "SetState";
  arguments: {
    entity: ValueRef<EngineEntity> | MoveArgumentBinding<EngineEntity>;
    state: StateUpdate;
  };
}

export interface MoveSetActivePlayers extends MoveCommon {
  moveType: "SetActivePlayers";
  options: SetActivePlayersOptions;
}

export interface MoveEndTurn extends MoveCommon {
  moveType: "EndTurn";
}

export interface MovePassTurn extends MoveCommon {
  moveType: "PassTurn";
}

export interface MovePass extends MoveCommon {
  moveType: "Pass";
}

export interface MoveForEach extends MoveCommon {
  moveType: "ForEach";
  arguments: {
    targets: ValueRef<EngineEntity[]> | MoveArgumentBinding<EngineEntity[]> | ReadonlyArray<string | number>;
  };
  move: MoveDefinition;
}

export interface MoveShuffle extends MoveCommon {
  moveType: "Shuffle";
  arguments: {
    target: MoveArgumentBinding<EngineEntity>;
  };
}

// ---------------------------------------------------------------------------
// Turn, stages, phases, end rules
// ---------------------------------------------------------------------------

export interface TurnConfig {
  minMoves?: number;
  maxMoves?: number;
  initialMoves?: MoveDefinition[];
  activePlayers?: Record<string, string>;
  stages?: Record<string, StageConfig>;
  order?: { playOrder?: "RotateFirst" };
}

export interface StageConfig {
  initialMoves?: MoveDefinition[];
  moves?: Record<string, MoveDefinition>;
}

export interface PhaseConfig {
  start?: boolean;
  next?: string;
  turn?: TurnConfig;
  moves?: Record<string, MoveDefinition>;
  initialMoves?: MoveDefinition[];
  endIf?: EndRule[];
}

export interface EndRule {
  conditions: Condition[];
  result?: {
    winner?: string | ValueRef<unknown>;
    winners?: ValueRef<unknown>;
    draw?: boolean;
    [k: string]: unknown;
  };
}

// ---------------------------------------------------------------------------
// Initial placement
// ---------------------------------------------------------------------------

export interface InitialPlacement {
  /** Matcher to locate the entity definition, plus optional `state` applied when placing. */
  entity: EntityMatcher<EntityAttributes<Entity>> & { state?: EntityState };
  destination: { index?: number; name?: string };
}

// ---------------------------------------------------------------------------
// Game config (top level)
// ---------------------------------------------------------------------------

/**
 * Authoring-time game JSON (before `expandGameRules`).
 * For an explicit alias at API boundaries, see `AuthoredGameRules` in `expanded-game-types.ts`.
 */
export interface BagelGame {
  entities: Entity[];
  sharedBoard?: EntityMatcher<EntityAttributes<Entity>>[];
  personalBoard?: EntityMatcher<EntityAttributes<Entity>>[];
  initialPlacements?: InitialPlacement[];
  numPlayers?: number;
  minPlayers?: number;
  maxPlayers?: number;
  turn?: TurnConfig;
  moves?: Record<string, MoveDefinition>;
  initialMoves?: MoveDefinition[];
  phases?: Record<string, PhaseConfig>;
  endIf?: EndRule[];
  /** Engine/debug: skip `playerView` masking of hidden information. */
  DEBUG_DISABLE_SECRET_STATE?: boolean;
}

