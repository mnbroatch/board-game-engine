import getSteps from "./get-steps.js";

export default function createPayload (
  bgioState: Parameters<typeof getSteps>[0],
  moveRule: Parameters<typeof getSteps>[1],
  targets: unknown[],
  _context: Record<string, unknown>
) {
  const argNames = getSteps(
    bgioState,
    moveRule
  ).map((s) => s.argName);
  return {
    arguments: targets.reduce<Record<string, unknown>>((acc, target, i) => ({
      ...acc,
      [argNames[i]]: target,
    }), {}),
  };
}
