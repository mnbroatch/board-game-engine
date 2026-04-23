import type { Condition as ConditionRule } from "../../types/expanded-game-types.js";
import Condition from "./condition.js";
import checkConditions from "../../utils/check-conditions.js";
import simulateMove from "../../utils/simulate-move.js";
import { bankOf, type BgioReadonlyState, type BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type {
  ConditionCheckResult,
  ConditionContext,
  ConditionPayload,
} from "../../types/condition-types.js";
import type { ResolvedConditionRule } from "../../types/resolved-condition-types.js";
import type {
  AbstractPickArgument,
  PreparedMoveArgument,
  PreparedMovePayload,
} from "../../types/move-payload.js";
import type { SimulatePreparedArguments } from "../../utils/simulate-move.js";

const argNameMap: Record<string, string[]> = {
  PlaceNew: ["destination"],
  RemoveEntity: ["entity"],
  MoveEntity: ["entity", "destination"],
  TakeFrom: ["source", "destination"],
  SetState: ["entity", "state"],
};

function isEntityLike (value: unknown): value is { entityId: number } {
  return Boolean(value && typeof value === "object" && typeof (value as { entityId?: unknown }).entityId === "number");
}

function isPreparedMoveArgument (value: unknown): value is PreparedMoveArgument {
  return typeof value === "number"
    || Boolean(value && typeof value === "object" && (value as AbstractPickArgument).abstract === true);
}

export default class WouldCondition extends Condition {
  checkCondition (
    bgioArguments: BgioReadonlyState | BgioResolveState,
    rule: ResolvedConditionRule,
    conditionPayload: ConditionPayload,
    context: ConditionContext
  ) {
    const target = conditionPayload.target;
    if (!context.moveInstance) {
      return { conditionIsMet: false };
    }

    const targets: unknown[] = conditionPayload.targets
      ?? (Array.isArray(target) ? target : [target]);

    const moveType = context.moveInstance?.rule?.moveType;
    const argNames = moveType ? argNameMap[moveType] : undefined;
    const payload: PreparedMovePayload<SimulatePreparedArguments> & {
      arguments: SimulatePreparedArguments;
    } = {
      arguments: targets.reduce<SimulatePreparedArguments>((acc, t, i) => {
        const key = argNames?.[i] ?? `arg${i}`;
        if (isPreparedMoveArgument(t)) {
          return { ...acc, [key]: t };
        }
        if (isEntityLike(t)) {
          return { ...acc, [key]: t.entityId };
        }
        return acc;
      }, {}),
    };

    if (!("events" in bgioArguments)) {
      throw new Error("WouldCondition: requires full boardgame.io move context (DefaultPluginAPIs)");
    }

    const simulatedG = simulateMove(
      bgioArguments as BgioResolveState,
      payload,
      { ...context, moveInstance: context.moveInstance }
    );

    let simulatedConditionsPayload: ConditionPayload = {};
    if (Array.isArray(target)) {
      simulatedConditionsPayload = {
        targets: target
          .filter(isEntityLike)
          .map((t) => simulatedG.bank.locate(t.entityId)),
      };
    } else if (target) {
      if (isEntityLike(target)) {
        simulatedConditionsPayload = {
          target: simulatedG.bank.locate(target.entityId),
        };
      }
    } else if (targets) {
      const entityTargets = targets.filter(isEntityLike);
      simulatedConditionsPayload = {
        targets: entityTargets.map((t) => simulatedG.bank.locate(t.entityId)),
      };
    }

    const conditionResults = checkConditions(
      { ...bgioArguments, G: simulatedG },
      (rule as { conditions?: ConditionRule[] }).conditions,
      simulatedConditionsPayload,
      context
    );

    const conditionIsMet = conditionResults.conditionsAreMet;

    const results = conditionIsMet
      ? restoreReferences(
        conditionResults.results,
        (entityId: unknown) => {
          if (typeof entityId !== "number") return entityId;
          return bankOf(bgioArguments).locate(entityId);
        }
      )
      : conditionResults.results;

    return {
      results: results as ConditionCheckResult["results"],
      conditionIsMet,
    };
  }
}

function restoreReferences (
  obj: unknown,
  getOriginalEntity: (id: unknown) => unknown,
  seen = new WeakSet<object>()
): unknown {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (seen.has(obj)) {
    return obj;
  }
  seen.add(obj);

  if (isEntityLike(obj)) {
    return getOriginalEntity(obj.entityId);
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => restoreReferences(item, getOriginalEntity, seen));
  }

  const restored: Record<string, unknown> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      restored[key] = restoreReferences((obj as Record<string, unknown>)[key], getOriginalEntity, seen);
    }
  }
  return restored;
}
