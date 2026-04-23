import type { Condition } from "./expanded-game-types.js";
import type { ConditionContains, ConditionContainsSame, ConditionEvaluate, ConditionEvery, ConditionHasLine, ConditionInLine, ConditionIs, ConditionIsFull, ConditionNoPossibleMoves, ConditionNot, ConditionOr, ConditionPosition, ConditionShorthandEntityType, ConditionShorthandString, ConditionSome, ConditionWould } from "./bagel-types.js";
import type { EngineEntity } from "./runtime-entity.js";
import type Grid from "../game-factory/space-group/grid.js";
export type ResolvedConditionShorthandString = ConditionShorthandString;
export type ResolvedConditionShorthandEntityType = ConditionShorthandEntityType;
export type ResolvedConditionHasLine = Omit<ConditionHasLine, "target"> & {
    target: Grid;
};
export type ResolvedConditionIsFull = Omit<ConditionIsFull, "target"> & {
    target: EngineEntity;
};
export type ResolvedConditionNoPossibleMoves = ConditionNoPossibleMoves;
export type ResolvedConditionPosition = ConditionPosition;
export type ResolvedConditionContainsSame = ConditionContainsSame;
export type ResolvedConditionIs = Omit<ConditionIs, "target" | "entity"> & {
    target?: EngineEntity | EngineEntity[];
    entity?: EngineEntity;
};
export type ResolvedConditionContains = Omit<ConditionContains, "target"> & {
    target?: EngineEntity | EngineEntity[];
};
export type ResolvedConditionNot = Omit<ConditionNot, "target"> & {
    target?: EngineEntity | EngineEntity[];
};
export type ResolvedConditionOr = ConditionOr;
export type ResolvedConditionSome = Omit<ConditionSome, "target">;
export type ResolvedConditionEvery = Omit<ConditionEvery, "target">;
export type ResolvedConditionInLine = Omit<ConditionInLine, "target"> & {
    target: EngineEntity;
    grid: Grid;
};
export type ResolvedConditionEvaluate = ConditionEvaluate;
export type ResolvedConditionWould = ConditionWould;
export type ResolvedConditionTyped = ResolvedConditionHasLine | ResolvedConditionIsFull | ResolvedConditionNoPossibleMoves | ResolvedConditionPosition | ResolvedConditionContainsSame | ResolvedConditionIs | ResolvedConditionContains | ResolvedConditionNot | ResolvedConditionOr | ResolvedConditionSome | ResolvedConditionEvery | ResolvedConditionInLine | ResolvedConditionEvaluate | ResolvedConditionWould;
export type ResolvedConditionRule = ResolvedConditionShorthandString | ResolvedConditionShorthandEntityType | ResolvedConditionTyped;
/** Post-expand condition tree passed into {@link ../utils/resolve-condition.resolveCondition}. */
export type UnresolvedConditionRule = Condition;
//# sourceMappingURL=resolved-condition-types.d.ts.map