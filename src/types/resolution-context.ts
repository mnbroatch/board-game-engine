import type Move from "../game-factory/move/move.js";
import type { Condition } from "./expanded-game-types.js";
import type { EngineEntity } from "./runtime-entity.js";
import type { GetCurrentMovesClient } from "../utils/get-current-moves.js";
import type { MoveArgumentBinding } from "./expanded-game-types.js";

/**
 * Single value stored under a move argument name while resolving / validating moves.
 * (Entity, id, abstract pick, selector, etc.)
 */
export type AbstractPickArgument = {
  abstract?: boolean;
  entityId?: unknown;
  value?: unknown;
};

export type MoveArgumentValue =
  | EngineEntity
  | EngineEntity[]
  | AbstractPickArgument
  | MoveArgumentBinding;

/**
 * Open-ended map of move argument names to values (keys come from authored rules).
 * Uses an index signature with {@link MoveArgumentValue} instead of `Record<string, unknown>`.
 */
export type MoveArgumentsState = { [argumentName: string]: MoveArgumentValue | undefined };

/**
 * Engine-reserved context passed through ref resolution, condition checks, and move execution.
 * No arbitrary string index beyond {@link MoveArgumentsState} fields on `moveArguments` / `previousArguments`.
 */
export interface ResolutionContext {
  moveInstance?: Move;
  moveArguments?: MoveArgumentsState;
  previousArguments?: MoveArgumentsState;
  /** Carried into expression evaluation; mirrors payload target when set. */
  target?: EngineEntity | EngineEntity[];
  originalTarget?: EngineEntity | EngineEntity[];
  loopTarget?: EngineEntity;
  /** Aggregated condition results (e.g. composite / Every). */
  results?: ConditionCheckResult[];
  /**
   * Some conditions (e.g. NoPossibleMoves) need the current game definition and player/stage
   * to resolve the active move set.
   */
  game?: GetCurrentMovesClient["game"];
  playerID?: GetCurrentMovesClient["playerID"];
  stageName?: GetCurrentMovesClient["stageName"];
}

/** Alias used by condition implementations. */
export type ConditionContext = ResolutionContext;

/**
 * Aggregate from {@link ../utils/check-conditions.checkConditions} (composite / Every / nested runs).
 */
export type CheckConditionsResult = {
  results: ConditionCheckResult[];
  failedAt?: Condition;
  conditionsAreMet: boolean;
};

/**
 * Result from a single condition implementation (before aggregation in checkConditions).
 */
export type ConditionCheckResult = {
  conditionIsMet: boolean;
  matches?: unknown;
  result?: unknown;
  target?: EngineEntity | EngineEntity[];
  /**
   * Nested aggregates: `Every` yields {@link CheckConditionsResult} per target; `Would` yields a
   * flat list of {@link ConditionCheckResult} from the inner check pass.
   */
  results?: CheckConditionsResult[] | ConditionCheckResult[];
};
