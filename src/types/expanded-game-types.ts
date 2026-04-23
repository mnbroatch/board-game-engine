import type {
  BagelGame,
  ConditionContainsSame as AuthoredConditionContainsSame,
  ConditionHasLine as AuthoredConditionHasLine,
  ConditionIsFull as AuthoredConditionIsFull,
  ConditionNoPossibleMoves as AuthoredConditionNoPossibleMoves,
  ConditionPosition as AuthoredConditionPosition,
  ConditionShorthandEntityType as AuthoredConditionShorthandEntityType,
  ConditionShorthandString as AuthoredConditionShorthandString,
  EndRule as AuthoredEndRule,
  Entity,
  EntityLineTargetRef as AuthoredEntityLineTargetRef,
  EntityMatcher,
  GridValueRef as AuthoredGridValueRef,
  PhaseConfig as AuthoredPhaseConfig,
  SetActivePlayersOptions,
  StateUpdate,
  TurnConfig as AuthoredTurnConfig,
  ValueRef,
} from "./bagel-types.js";
import type { EngineEntity } from "./runtime-entity.js";

/**
 * Raw game JSON accepted by `expandGameRules`.
 * Same shape as {@link BagelGame}; use this name at API boundaries to signal “pre-expand”.
 */
export type AuthoredGameRules = BagelGame;

/**
 * After `expandGameRules`, entity `name` strings on `target` are rewritten to selector objects,
 * so bare `string` no longer appears there for those fields.
 */
/** `GridValueRef` after expand-time normalization (no bare entity-name `string`). */
export type GridValueRef = Exclude<AuthoredGridValueRef, string>;

/** Same normalization as {@link GridValueRef} for entity-line condition `target` fields. */
export type EntityLineTargetRef = Exclude<AuthoredEntityLineTargetRef, string>;

/** `HasLine` after expand-time normalization of `target`. */
export interface ConditionHasLine extends Omit<AuthoredConditionHasLine, "target" | "sequence"> {
  target: GridValueRef;
  sequence: LineSequenceStep[];
}

/** One step in a line sequence after expand. */
export interface LineSequenceStep {
  minCount?: number;
  conditions: Condition[];
}

/** `IsFull` after expand-time normalization of `target`. */
export interface ConditionIsFull extends Omit<AuthoredConditionIsFull, "target"> {
  target: GridValueRef;
}

export type TargetSelector = {
  matchMultiple?: boolean;
  conditions: Condition | Condition[];
};

export interface ConditionIs {
  conditionType: "Is";
  target?: EntityLineTargetRef;
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

export interface ConditionWould {
  conditionType: "Would";
  conditions?: Condition[];
}

/**
 * Condition tree after `expandGameRules` (shorthand strings and `target` name shortcuts normalized).
 */
export type Condition =
  | AuthoredConditionShorthandString
  | AuthoredConditionShorthandEntityType
  | ConditionHasLine
  | ConditionIsFull
  | AuthoredConditionNoPossibleMoves
  | AuthoredConditionPosition
  | AuthoredConditionContainsSame
  | ConditionIs
  | ConditionContains
  | ConditionNot
  | ConditionOr
  | ConditionSome
  | ConditionEvery
  | ConditionInLine
  | ConditionEvaluate
  | ConditionWould;

/** Expanded conditions excluding top-level `Would` (matches readonly `checkConditions` overload). */
export type ConditionWithoutWould = Exclude<Condition, ConditionWould>;

/** `EndRule` with expanded condition list. */
export type EndRule = Omit<AuthoredEndRule, "conditions"> & {
  conditions: Condition[];
};

export type MoveArgumentBinding<TResolved = unknown> = {
  conditions?: Condition | Condition[];
  playerChoice?: boolean;
  possibleValues?: TResolved[];
  resolveAsEntity?: boolean;
} & Record<string, unknown>;

export interface MoveCommon {
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
    targets:
      | ValueRef<EngineEntity[]>
      | MoveArgumentBinding<EngineEntity[]>
      | ReadonlyArray<string | number>;
  };
  move: MoveDefinition;
}

export interface MoveShuffle extends MoveCommon {
  moveType: "Shuffle";
  arguments: {
    target: MoveArgumentBinding<EngineEntity>;
  };
}

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

export interface StageConfig {
  initialMoves?: MoveDefinition[];
  moves?: Record<string, MoveDefinition>;
}

export type TurnConfig = Omit<AuthoredTurnConfig, "initialMoves" | "stages"> & {
  initialMoves?: MoveDefinition[];
  stages?: Record<string, StageConfig>;
};

/** Phase config after expand. */
export type PhaseConfig = Omit<AuthoredPhaseConfig, "endIf" | "turn" | "moves" | "initialMoves"> & {
  endIf?: EndRule[];
  turn?: TurnConfig;
  moves?: Record<string, MoveDefinition>;
  initialMoves?: MoveDefinition[];
};

/**
 * Rules after `expandGameRules`: invariant entities merged, default turn/sharedBoard,
 * initial placements expanded into moves; `initialPlacements` is removed.
 *
 * Condition and move subtrees use expanded shapes (no entity-name string on `target` fields that
 * the expander rewrites; shorthand condition strings normalized where the transform applies).
 */
export type GameRules = Omit<
  AuthoredGameRules,
  "entities" | "turn" | "initialPlacements" | "endIf" | "phases" | "moves" | "initialMoves"
> & {
  entities: Entity[];
  turn: TurnConfig;
  endIf?: EndRule[];
  phases?: Record<string, PhaseConfig>;
  moves?: Record<string, MoveDefinition>;
  initialMoves?: MoveDefinition[];
};
