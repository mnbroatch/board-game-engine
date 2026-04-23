import type { MoveDefinition } from "../types/expanded-game-types.js";
import type { BoardgameIoGame } from "../game-factory/game-factory.js";
import type { BgioResolveState } from "./bgio-resolve-types.js";
import type { ResolutionContext } from "../types/resolution-context.js";
export type DoMovesContext = ResolutionContext & {
    game: BoardgameIoGame;
};
export default function doMoves(bgioArguments: BgioResolveState, moves: MoveDefinition[] | undefined, context: DoMovesContext): import("./bgio-resolve-types.js").BoardgameEngineG;
//# sourceMappingURL=do-moves.d.ts.map