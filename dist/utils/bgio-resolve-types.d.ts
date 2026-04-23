import type { Ctx, DefaultPluginAPIs, PlayerID } from "@mnbroatch/boardgame.io";
import type Bank from "../game-factory/bank/bank.js";
import type { MovePayload } from "../types/move-payload.js";
import type { MoveArgumentsMap } from "../types/move-arguments.js";
import type { EngineEntity } from "../types/runtime-entity.js";
/** Engine-owned `_meta` bag on `G` (survives logical serialize/deserialize boundaries). */
export interface BoardgameEngineMeta {
    passedPlayers: string[];
    previousPayloads: {
        [moveName: string]: MovePayload<MoveArgumentsMap> | undefined;
    };
    currentPhaseHasBeenSetUp?: boolean;
    nextPhase?: string;
    isAfterFirstPhase?: boolean;
}
/**
 * boardgame.io `G` for engine-built games: `bank`, `_meta`, and optional board roots only.
 * Custom values live on entities (via `bank`) or in `_meta`, not as extra top-level keys on `G`.
 */
export interface BoardgameEngineG {
    bank: Bank;
    _meta: BoardgameEngineMeta;
    sharedBoard?: EngineEntity;
    personalBoards?: (EngineEntity | undefined)[];
}
/**
 * Minimal hook-shaped state for readonly checks and resolution (G + ctx + playerID).
 * Every {@link BgioResolveState} is assignable here; callers may use this to avoid implying full plugin APIs.
 */
export type BgioReadonlyState = {
    G: BoardgameEngineG;
    ctx: Ctx;
    playerID?: PlayerID | null;
};
/** boardgame.io hook / move context (no extra PluginAPIs index signature). */
export type BgioFnContext<G extends BoardgameEngineG = BoardgameEngineG> = DefaultPluginAPIs & {
    G: G;
    ctx: Ctx;
};
/** boardgame.io match args + engine `G` after setup (deserialized, many fields). */
export type BgioResolveState = BgioFnContext<BoardgameEngineG> & {
    playerID?: PlayerID | null;
};
export declare function bankOf(bg: BgioReadonlyState): Bank;
//# sourceMappingURL=bgio-resolve-types.d.ts.map