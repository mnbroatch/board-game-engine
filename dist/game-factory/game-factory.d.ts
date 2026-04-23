import type { Game } from "@mnbroatch/boardgame.io";
import type { AuthoredGameRules } from "../types/expanded-game-types.js";
import type { BoardgameEngineG } from "../utils/bgio-resolve-types.js";
export type { BoardgameEngineG, BoardgameEngineMeta } from "../utils/bgio-resolve-types.js";
/** boardgame.io `Game` definition produced by {@link gameFactory}. */
export type BoardgameIoGame = Game<BoardgameEngineG>;
export default function gameFactory(gameRules: AuthoredGameRules, gameName: string): BoardgameIoGame;
//# sourceMappingURL=game-factory.d.ts.map