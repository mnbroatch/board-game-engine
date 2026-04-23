export type {
  // post-expand / runtime rules
  GameRules,
  Condition,
  ConditionWithoutWould,
  EndRule,
  MoveDefinition,
  MoveCommon,
  MoveArgumentBinding,
  MovePlaceNew,
  MoveMoveEntity,
  MoveRemoveEntity,
  MoveTakeFrom,
  MoveSetState,
  MoveSetActivePlayers,
  MoveEndTurn,
  MovePassTurn,
  MovePass,
  MoveForEach,
  MoveShuffle,
  StageConfig,
  TurnConfig,
  PhaseConfig,
  // runtime selectors / refs
  GridValueRef,
  EntityLineTargetRef,
  LineSequenceStep,
  TargetSelector,
} from "./expanded-game-types.js";

export type { EntityDefinition } from "./entity-definition.js";
export type { RuleWithConditions } from "./rule-with-conditions.js";
