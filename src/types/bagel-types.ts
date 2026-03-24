/**
 * B.A.G.E.L. (Board-based Automated Game Engine Language) types.
 * Subset inferred from the built-in example games.
 *
 * Semantic notes:
 * - EntityAttributes<TRule> = entity rule merged with its default state (runtime view).
 * - displayProperties lists keys of that merged type; UI shows those attribute values.
 * - EntityMatcher is matched against EntityAttributes (lodash-style) at runtime.
 */

// ---------------------------------------------------------------------------
// Value references (resolved at runtime from context, game state, or expressions)
// ---------------------------------------------------------------------------

export type PathSegment = string | number | { flatten: boolean; map?: string[] };

export type ValueRef =
  | CtxPathRef
  | ContextPathRef
  | GamePathRef
  | ExpressionRef
  | RelativeCoordinatesRef
  | CoordinatesRef
  | RelativePathRef
  | ParentRef
  | MapRef
  | MapMaxRef
  | PickRef
  | CountRef;

export interface CtxPathRef {
  type: "ctxPath";
  path: (string | number)[];
}

export interface ContextPathRef {
  type: "contextPath";
  path: PathSegment[];
}

export interface GamePathRef {
  type: "gamePath";
  path: (string | number)[];
}

export interface ExpressionRef {
  type: "expression";
  expression: string;
  arguments: Record<string, ValueRef>;
}

export interface RelativeCoordinatesRef {
  type: "relativeCoordinates";
  target?: ValueRef;
  location: [number, number] | ValueRef;
}

export interface CoordinatesRef {
  type: "coordinates";
  target?: ValueRef;
}

export interface RelativePathRef {
  type: "relativePath";
  target: ValueRef | TargetSelector;
  path: (string | number)[];
}

export interface ParentRef {
  type: "parent";
  target?: ValueRef;
}

export interface MapRef {
  type: "map";
  targets: ValueRef | TargetSelector;
  mapping: ValueRef | CountRef;
}

export interface MapMaxRef {
  type: "mapMax";
  targets: ValueRef;
  mapping: ValueRef | CountRef;
}

export interface PickRef {
  type: "pick";
  target: ValueRef | TargetSelector;
  properties: string[];
}

export interface CountRef {
  type: "count";
  conditions: Condition[];
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
  | ConditionEvaluate;

export interface TargetSelector {
  matchMultiple?: boolean;
  conditions: Condition[];
}

export interface LineSequenceStep {
  minCount?: number;
  conditions: Condition[];
}

export interface ConditionHasLine {
  conditionType: "HasLine";
  target: string;
  sequence: LineSequenceStep[];
}

export interface ConditionIsFull {
  conditionType: "IsFull";
  target: string;
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
  target?: ValueRef | TargetSelector | string;
  matcher?: Record<string, unknown>;
  entity?: ValueRef;
}

export interface ConditionContains {
  conditionType: "Contains";
  target?: ValueRef | TargetSelector | string;
  conditions?: Condition[];
}

export interface ConditionNot {
  conditionType: "Not";
  target?: ValueRef | TargetSelector | string;
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
  target?: ValueRef;
  sequence: LineSequenceStep[];
}

export interface ConditionEvaluate {
  conditionType: "Evaluate";
  expression: string;
  arguments: Record<string, ValueRef>;
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
  { [K in keyof A]: A[K] | ValueRef }
> & { name?: string };

export interface EntityBoard extends EntityCommon {
  entityType: "Board";
}

export type Entity = EntityGrid | EntitySpace | EntityGeneric | EntityBoard;

export interface EntityCommon {
  name: string;
  perPlayer?: boolean;
  count?: number | "Infinity";
  state?: Record<string, unknown>;
  contentsHiddenFrom?: "All" | "Others";
  /** Expanded into separate entity definitions at setup (see game-factory). */
  variants?: Array<Record<string, unknown>>;
}

export interface EntityGrid extends EntityCommon {
  entityType: "Grid";
  width: number;
  height: number;
  /** Property names to show in UI; values read from EntityAttributes<EntityGrid>. */
  displayProperties?: (keyof EntityAttributes<EntityGrid>)[];
}

export interface EntitySpace extends EntityCommon {
  entityType: "Space";
  /** Property names to show in UI; values read from EntityAttributes<EntitySpace>. */
  displayProperties?: (keyof EntityAttributes<EntitySpace>)[];
}

export interface EntityGeneric extends EntityCommon {
  entityType?: undefined;
  /** Property names to show in UI; values read from EntityAttributes<EntityGeneric> (rule merged with state). */
  displayProperties?: (keyof EntityAttributes<EntityGeneric>)[];
}

export type EntityRule = EntityGrid | EntitySpace | EntityGeneric | EntityBoard;

// ---------------------------------------------------------------------------
// Moves
// ---------------------------------------------------------------------------

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

export type MoveRule = MoveDefinition;

export interface MoveCommon {
  /** Set when a move is registered under a key (e.g. from `createMoves`). */
  name?: string;
  conditions?: Condition[];
  then?: MoveDefinition[];
}

export interface MovePlaceNew extends MoveCommon {
  moveType: "PlaceNew";
  matchMultiple?: boolean;
  entity: { conditions?: Condition[]; [k: string]: unknown };
  arguments: {
    destination: Record<string, unknown>;
    [k: string]: unknown;
  };
}

export interface MoveMoveEntity extends MoveCommon {
  moveType: "MoveEntity";
  position?: "First";
  arguments: {
    entity: Record<string, unknown>;
    destination: Record<string, unknown>;
    [k: string]: unknown;
  };
}

export interface MoveRemoveEntity extends MoveCommon {
  moveType: "RemoveEntity";
  arguments: { entity: ValueRef | Record<string, unknown>; [k: string]: unknown };
}

export interface MoveTakeFrom extends MoveCommon {
  moveType: "TakeFrom";
  arguments: {
    source: Record<string, unknown>;
    destination: Record<string, unknown>;
    [k: string]: unknown;
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
    entity: ValueRef | Record<string, unknown>;
    state: StateUpdate;
    [k: string]: unknown;
  };
}

export interface MoveSetActivePlayers extends MoveCommon {
  moveType: "SetActivePlayers";
  options: Record<string, { stage?: string; [k: string]: unknown }>;
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
  arguments: { targets: ValueRef | Record<string, unknown>; [k: string]: unknown };
  move: MoveDefinition;
}

export interface MoveShuffle extends MoveCommon {
  moveType: "Shuffle";
  arguments: { target: Record<string, unknown>; [k: string]: unknown };
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
    winner?: string | ValueRef;
    winners?: ValueRef;
    draw?: boolean;
    [k: string]: unknown;
  };
}

// ---------------------------------------------------------------------------
// Initial placement
// ---------------------------------------------------------------------------

export interface InitialPlacement {
  entity: Record<string, unknown>;
  destination: { index?: number; name?: string };
}

// ---------------------------------------------------------------------------
// Game config (top level)
// ---------------------------------------------------------------------------

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
}

/** Rule object passed to `gameFactory` (engine-specific extensions on top of BagelGame). */
export type GameFactoryInput = BagelGame & {
  DEBUG_DISABLE_SECRET_STATE?: boolean;
};

/**
 * Rules after {@link expandGameRules}: invariant entities merged, default turn/sharedBoard,
 * initial placements expanded into moves; `initialPlacements` is removed.
 */
export type ExpandedGameRules = Omit<GameFactoryInput, "entities" | "turn" | "initialPlacements"> & {
  entities: Entity[];
  turn: TurnConfig;
};
