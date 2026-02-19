import Condition from "./condition.js";
import checkConditions from "../utils/check-conditions.js";
import simulateMove from "../utils/simulate-move.js";

// relying on target order is not perfect;
// I think we'll want to switch to named arguments
const argNameMap = {
  PlaceNew: ['destination'],
  RemoveEntity: ['entity'],
  MoveEntity: ['entity', 'destination'],
  TakeFrom: ['source', 'destination'],
  SetState: ['entity', 'state'],
}

export default class WouldCondition extends Condition {
  checkCondition(bgioArguments, rule, { target, targets = [target] }, context) {
    const payload = {
      arguments: targets.reduce((acc, target, i) => ({
        ...acc,
        [argNameMap[context.moveInstance.rule.type][i]]: target
      }), {})
    }

    const simulatedG = simulateMove(
      bgioArguments,
      payload,
      context
    )

    let simulatedConditionsPayload = {}
    if (target) {
      simulatedConditionsPayload = {
        target: simulatedG.bank.locate(target.entityId)
      }
    } else if (targets) {
      simulatedConditionsPayload = {
        targets: targets.map(t => simulatedG.bank.locate(t.entityId))
      }
    }

    const conditionResults = checkConditions(
      {
        ...bgioArguments,
        G: simulatedG
      },
      rule,
      simulatedConditionsPayload,
      context
    )

    const conditionIsMet = conditionResults.conditionsAreMet

    // optimization: don't bother restoring on failure
    const results = conditionIsMet
      ? restoreReferences(
        conditionResults.results,
        entityId => bgioArguments.G.bank.locate(entityId)
      )
      : conditionResults.results

    return {
      results,
      conditionIsMet
    }
  }
}

// references to simulated object are useless
function restoreReferences(obj, getOriginalEntity, seen = new WeakSet()) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  if (seen.has(obj)) {
    return obj;
  }
  seen.add(obj);
  
  if (obj.entityId !== undefined) {
    return getOriginalEntity(obj.entityId);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => restoreReferences(item, getOriginalEntity, seen));
  } else {
    const restored = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        restored[key] = restoreReferences(obj[key], getOriginalEntity, seen);
      }
    }
    return restored;
  }
}
