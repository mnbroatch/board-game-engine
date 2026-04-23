import getSteps from "./get-steps.js";
import type { MovePayload } from "../types/move-payload.js";
import type { MoveArgumentsMap } from "../types/move-arguments.js";
import type { MoveArgumentValue, MoveArgumentsState, ResolutionContext } from "../types/resolution-context.js";

export default function createPayload (
  bgioState: Parameters<typeof getSteps>[0],
  moveRule: Parameters<typeof getSteps>[1],
  targets: readonly unknown[],
  _context: ResolutionContext
): MovePayload<MoveArgumentsMap> {
  const argNames = getSteps(
    bgioState,
    moveRule
  ).map((s) => s.argName);
  return {
    arguments: targets.reduce<MoveArgumentsState>((acc, target, i) => ({
      ...acc,
      [argNames[i]]: target as MoveArgumentValue,
    }), {}),
  };
}
