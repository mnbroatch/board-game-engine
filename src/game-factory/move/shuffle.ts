import type { MoveDefinition } from "../../types/expanded-game-types.js";
import type { ShuffleDoPayload } from "../../types/move-payload.js";
import type { BgioResolveState } from "../../utils/bgio-resolve-types.js";
import type { ResolutionContext } from "../../types/resolution-context.js";
import Move from "./move.js";

type BgioWithShuffleRandom = BgioResolveState & {
  random: { Shuffle: <T>(xs: T[]) => T[] };
};

export default class Shuffle extends Move<NonNullable<ShuffleDoPayload["arguments"]>> {
  do (
    bgioArguments: BgioResolveState,
    _rule: MoveDefinition,
    resolvedPayload: ShuffleDoPayload,
    _context: ResolutionContext
  ) {
    const { target } = resolvedPayload.arguments;
    const b = bgioArguments as BgioWithShuffleRandom;
    target.entities = b.random.Shuffle(target.entities);
  }
}
