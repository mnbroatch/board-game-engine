import { bankOf, type BgioReadonlyState } from "./bgio-resolve-types.js";
import type { MoveArgumentBinding } from "../types/expanded-game-types.js";
import type { ResolutionContext } from "../types/resolution-context.js";

// controls order of what players need to click first
const argNamesMap: Record<string, string[]> = {
  PlaceNew: ["destination"],
  RemoveEntity: ["entity"],
  MoveEntity: ["entity", "destination"],
  TakeFrom: ["source", "destination"],
  SetState: ["entity", "state"],
};

// this might not be where special handling for setstate wants to live
export default function getSteps (
  bgioState: BgioReadonlyState,
  moveRule: {
    moveType: string;
    arguments?: { [argumentName: string]: MoveArgumentBinding | undefined };
  }
) {
  const names = argNamesMap[moveRule.moveType];
  if (!names) return [];
  const args = moveRule.arguments ?? {};
  return names
    .filter((argName) => args[argName]?.playerChoice)
    .map((argName) => ({
      argName,
      getClickable: argName === "state"
        ? () => ((args[argName]?.possibleValues ?? []) as unknown[]).map((value) => ({
            abstract: true,
            ...args[argName],
            value,
          }))
        : (context: ResolutionContext) => {
            const binding = args[argName];
            if (!binding) return [];
            return bankOf(bgioState).findAll(
              bgioState,
              binding,
              context
            );
          },
    }));
}
