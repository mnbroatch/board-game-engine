import type { MoveDefinition } from "../types/expanded-game-types.js";
import moveFactory from "../game-factory/move/move-factory.js";
import type { BoardgameIoGame } from "../game-factory/game-factory.js";
import type { BgioResolveState } from "./bgio-resolve-types.js";
import type { ResolutionContext } from "../types/resolution-context.js";

export type DoMovesContext = ResolutionContext & { game: BoardgameIoGame };

export default function doMoves (
  bgioArguments: BgioResolveState,
  moves: MoveDefinition[] = [],
  context: DoMovesContext
) {
  if (!moves?.length) {
    return bgioArguments.G;
  }

  moves.forEach((moveRule) => {
    moveFactory(moveRule, context.game).moveInstance.doMove(
      bgioArguments,
      undefined,
      context
    );
  });

  return bgioArguments.G;
}
