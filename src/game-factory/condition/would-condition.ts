import type { Condition as ConditionRule } from "../../types/bagel-types.js";
import Condition from "./condition.js";
import checkConditions from "../../utils/check-conditions.js";
import simulateMove from "../../utils/simulate-move.js";
import type { BgioResolveState } from "../../utils/bgio-resolve-types.js";

const argNameMap: Record<string, string[]> = {
  PlaceNew: ["destination"],
  RemoveEntity: ["entity"],
  MoveEntity: ["entity", "destination"],
  TakeFrom: ["source", "destination"],
  SetState: ["entity", "state"],
};

export default class WouldCondition extends Condition {
  checkCondition (
    bgioArguments: unknown,
    rule: unknown,
    conditionPayload: Record<string, unknown>,
    context: Record<string, unknown>
  ) {
    const target = conditionPayload.target;
    const targets = (conditionPayload.targets as unknown[] | undefined) ?? [target];

    const moveType = (context.moveInstance as { rule: { moveType: string } } | undefined)?.rule?.moveType;
    const argNames = moveType ? argNameMap[moveType] : undefined;
    const payload = {
      arguments: targets.reduce<Record<string, unknown>>((acc, t, i) => {
        const key = argNames?.[i] ?? `arg${i}`;
        return { ...acc, [key]: t };
      }, {}),
    };

    const simulatedG = simulateMove(
      bgioArguments as BgioResolveState,
      payload as Parameters<typeof simulateMove>[1],
      context as Parameters<typeof simulateMove>[2]
    ) as { bank: { locate: (id: unknown) => unknown } };

    let simulatedConditionsPayload: Record<string, unknown> = {};
    if (target) {
      simulatedConditionsPayload = {
        target: simulatedG.bank.locate((target as { entityId: unknown }).entityId),
      };
    } else if (targets) {
      simulatedConditionsPayload = {
        targets: targets.map((t) => simulatedG.bank.locate((t as { entityId: unknown }).entityId)),
      };
    }

    const conditionResults = checkConditions(
      { ...(bgioArguments as BgioResolveState), G: simulatedG } as BgioResolveState,
      (rule as { conditions?: ConditionRule[] }).conditions,
      simulatedConditionsPayload,
      context
    );

    const conditionIsMet = conditionResults.conditionsAreMet;

    const results = conditionIsMet
      ? restoreReferences(
        conditionResults.results,
        (entityId: unknown) =>
          (bgioArguments as { G: { bank: { locate: (id: unknown) => unknown } } }).G.bank.locate(entityId)
      )
      : conditionResults.results;

    return {
      results,
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

  if ((obj as { entityId?: unknown }).entityId !== undefined) {
    return getOriginalEntity((obj as { entityId: unknown }).entityId);
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
