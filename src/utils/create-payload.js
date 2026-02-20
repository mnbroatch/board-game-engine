import getSteps from './get-steps.js';

export default function createPayload (bgioState, moveRule, targets, context) {
  const argNames = getSteps(
    bgioState,
    moveRule,
    context
  ).map(s => s.argName)
  return {
    arguments: targets.reduce((acc, target, i) => ({
      ...acc,
      [argNames[i]]: target
    }), {})
  }
}

