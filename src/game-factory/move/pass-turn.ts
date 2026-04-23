import type { MoveDefinition } from "../../types/expanded-game-types.js";
import type { MovePayload } from "../../types/move-payload.js";
import type { MoveArgumentsMap } from "../../types/move-arguments.js";
import type { ResolutionContext } from "../../types/resolution-context.js";
import type { BgioResolveState } from "../../utils/bgio-resolve-types.js";
import Move from "./move.js";

type PassTurnBgio = BgioResolveState & {
  G: { _meta: { passedPlayers: string[] } };
  ctx: { numPlayers: number; currentPlayer: string };
  events: { pass: () => void };
};

export default class PassTurn extends Move<MoveArgumentsMap> {
  do (
    bgioArguments: BgioResolveState,
    _rule: MoveDefinition,
    _resolvedPayload: MovePayload<MoveArgumentsMap>,
    _context: ResolutionContext
  ) {
    const a = bgioArguments as PassTurnBgio;
    if (a.G._meta.passedPlayers.length < a.ctx.numPlayers) {
      a.G._meta.passedPlayers.push(a.ctx.currentPlayer);
      a.events.pass();
    }
  }
}
