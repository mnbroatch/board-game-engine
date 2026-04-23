export type { AuthoredGameRules, AuthoredCondition, AuthoredMoveDefinition, AuthoredTurnConfig, AuthoredPhaseConfig, AuthoredEndRule, InitialPlacement, AuthoredGridValueRef, AuthoredEntityLineTargetRef, ValueRef, ContextPathRef, CtxPathRef, ExpressionRef, CoordinatesRef, RelativeCoordinatesRef, AuthoredEntity, } from "./authored.js";
export type { GameRules, GridValueRef, EntityLineTargetRef, LineSequenceStep, TargetSelector, Condition, ConditionWithoutWould, EndRule, MoveArgumentBinding, MoveCommon, MoveDefinition, MovePlaceNew, MoveMoveEntity, MoveRemoveEntity, MoveTakeFrom, MoveSetState, MoveSetActivePlayers, MoveEndTurn, MovePassTurn, MovePass, MoveForEach, MoveShuffle, StageConfig, TurnConfig, PhaseConfig, } from "./expanded-game-types.js";
export type { EntityDefinition } from "./entity-definition.js";
export type { AuthoredRuleWithConditions, RuleWithConditions } from "./rule-with-conditions.js";
export type * from "./runtime.js";
export type { MovePayload, PlaceNewDestination, MoveEntityDestination, TakeFromSource, TakeFromDestination, PlaceNewDoPayload, MoveEntityDoPayload, RemoveEntityDoPayload, TakeFromDoPayload, SetStateDoPayload, ForEachDoPayload, ShuffleDoPayload, AbstractPickArgument, ClientArgument, ClientMovePayload, PreparedMoveArgument, PreparedMovePayload, SimulatedMoveArgument, SimulatedMovePayload, } from "./move-payload.js";
export type { ConditionCheckResult, ConditionContext, ConditionPayload, } from "./condition-types.js";
export type { MoveArgumentValue, MoveArgumentsState, ResolutionContext, } from "./resolution-context.js";
export type { MoveArgumentsMap } from "./move-arguments.js";
export type { JsonObject, JsonValue } from "./json.js";
export type { PreparedMoveArgumentsMap, SimulatedMoveArgumentsMap } from "./move-payload.js";
export type { DefaultEngineEntityAttributes, DefaultEngineEntityState, GameEntityShapeMap, RuntimeEntityRule, EngineEntityBase, EngineSpaceEntity, EngineSpaceGroupEntity, EngineEntity, EngineEntityContainer, } from "./runtime-entity.js";
export type { EntityValueRef, ContainerValueRef, } from "./typed-value-refs.js";
//# sourceMappingURL=index.d.ts.map