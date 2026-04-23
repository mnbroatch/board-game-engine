import type { BoardgameEngineG } from "./bgio-resolve-types.js";
import { reviveBoardgameEngineGFromUnknownRawG } from "./engine-serde-boundary.js";

export default function deserializeBgioArguments<T extends { G: unknown }>(
  bgioArguments: T
): T & { G: BoardgameEngineG } {
  return {
    ...bgioArguments,
    G: reviveBoardgameEngineGFromUnknownRawG(bgioArguments.G),
  };
}
