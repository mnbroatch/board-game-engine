import type { Game } from "@mnbroatch/boardgame.io";
import type { BagelGame } from "../types/bagel-types.js";
import type { BgioResolveState } from "../utils/bgio-resolve-types.js";
/** boardgame.io-style arguments (minimal typing; engine passes full objects). */
export type BgioArguments = BgioResolveState;
/** boardgame.io `Game` definition produced by {@link gameFactory}. */
export type BoardgameIoGame = Game;
export default function gameFactory(gameRules: BagelGame, gameName: string): BoardgameIoGame;
//# sourceMappingURL=game-factory.d.ts.map