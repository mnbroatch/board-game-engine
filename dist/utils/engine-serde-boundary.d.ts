import type { BoardgameEngineG } from "./bgio-resolve-types.js";
/** Revive `G` from boardgame.io (plain object) into engine graph via wackson + registry. */
export declare function reviveBoardgameEngineGFromUnknownRawG(rawG: unknown): BoardgameEngineG;
/** Deep clone `G` through wackson serialize + JSON.parse (boardgame.io move return shape). */
export declare function cloneBoardgameEngineGJsonRoundtrip(G: BoardgameEngineG): BoardgameEngineG;
/** Clone `G` through wackson serialize → deserialize (simulation / alternate clone path). */
export declare function cloneBoardgameEngineGWacksonRoundtrip(G: BoardgameEngineG): BoardgameEngineG;
/** Deserialize an arbitrary serializable value with the entity registry (e.g. move payload). */
export declare function deserializeWithRegistry<T>(serializable: unknown): T;
/** Deep clone arbitrary serializable data through wackson serialize + JSON.parse (transport clone). */
export declare function wacksonJsonClone<T>(value: T, serializeOptions?: {
    deduplicateInstances?: boolean;
}): T;
//# sourceMappingURL=engine-serde-boundary.d.ts.map