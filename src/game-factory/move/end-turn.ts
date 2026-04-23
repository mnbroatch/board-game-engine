import type { MoveDefinition } from "../../types/expanded-game-types.js";
import type { MovePayload } from "../../types/move-payload.js";
import type { MoveArgumentsMap } from "../../types/move-arguments.js";
import type { ResolutionContext } from "../../types/resolution-context.js";
import type { BgioResolveState } from "../../utils/bgio-resolve-types.js";
import Move from "./move.js";

type BgioWithEndTurn = BgioResolveState & {
  events: { endTurn: () => void };
};

export default class EndTurn extends Move<MoveArgumentsMap> {
  do (
    bgioArguments: BgioResolveState,
    _rule: MoveDefinition,
    _resolvedPayload: MovePayload<MoveArgumentsMap>,
    _context: ResolutionContext
  ) {
    (bgioArguments as BgioWithEndTurn).events.endTurn();
  }
}
