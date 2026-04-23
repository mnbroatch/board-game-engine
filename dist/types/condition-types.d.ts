import type { EngineEntity } from "./runtime-entity.js";
export type { ConditionCheckResult, ConditionContext, MoveArgumentValue, MoveArgumentsState, ResolutionContext, } from "./resolution-context.js";
/**
 * Shared condition payload shape passed into condition evaluation.
 *
 * Notes:
 * - Many conditions expect `target` (single entity, or an array for Some/Every) and/or `targets` (group).
 */
export type ConditionPayload<TTarget = EngineEntity | EngineEntity[]> = {
    target?: TTarget;
    targets?: (EngineEntity | undefined)[];
};
//# sourceMappingURL=condition-types.d.ts.map