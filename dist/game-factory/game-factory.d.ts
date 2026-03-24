import type { GameFactoryInput } from "../types/bagel-types.js";
import type { BgioResolveState } from "../utils/bgio-resolve-types.js";
/** boardgame.io-style arguments (minimal typing; engine passes full objects). */
export type BgioArguments = BgioResolveState;
/** Object returned from `gameFactory` (boardgame.io game definition). */
export type BoardGameEngineGame = Record<string, unknown> & {
    name: string;
};
export default function gameFactory(gameRules: GameFactoryInput, gameName: string): BoardGameEngineGame;
//# sourceMappingURL=game-factory.d.ts.map