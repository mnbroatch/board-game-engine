import { bankOf, type BgioResolveState } from "./bgio-resolve-types.js";

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
  bgioState: BgioResolveState,
  moveRule: {
    moveType: string;
    arguments: Record<string, { playerChoice?: boolean; possibleValues?: unknown[]; [k: string]: unknown }>;
  }
) {
  const names = argNamesMap[moveRule.moveType];
  if (!names) return [];
  return names
    .filter((argName) => moveRule.arguments[argName]?.playerChoice)
    .map((argName) => ({
      argName,
      getClickable: argName === "state"
        ? () => (moveRule.arguments[argName].possibleValues as unknown[]).map((value) => ({
            abstract: true,
            ...moveRule.arguments[argName],
            value,
          }))
        : (context: Record<string, unknown>) => bankOf(bgioState).findAll(
            bgioState,
            moveRule.arguments[argName],
            context
          ),
    }));
}
